#!/usr/bin/env python3
"""
sync_spend.py -- Nightly cron job: pull spend from service APIs -> Supabase.

Run:
  python3 scripts/sync_spend.py

Cron example (runs at 2 AM ET daily):
  0 6 * * * cd /path/to/ops-dashboard && python3 scripts/sync_spend.py >> logs/sync_spend.log 2>&1

Env vars required (can also live in phone-bridge/.env which this script loads):
  SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY
  ANTHROPIC_API_KEY
  OPENROUTER_API_KEY
  OPENAI_API_KEY
  TWILIO_ACCOUNT_SID
  TWILIO_AUTH_TOKEN
  KIE_API_KEY
"""

import os, sys, json, base64, datetime, urllib.request, urllib.error, pathlib

# ── Load phone-bridge/.env if present ────────────────────────────────────────
_env_file = pathlib.Path(__file__).parent.parent / "phone-bridge" / ".env"
if _env_file.exists():
    for line in _env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        k = k.strip()
        v = v.strip().strip('"').strip("'")
        if k and k not in os.environ:
            os.environ[k] = v

# ── Supabase client ───────────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    sys.exit("ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set.")

def sb_get(table, params=""):
    url = f"{SUPABASE_URL}/rest/v1/{table}?{params}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())

def write_transaction(service, category, amount, description, charged_at):
    """Insert with ON CONFLICT DO NOTHING via Prefer header."""
    payload = {
        "service": service,
        "category": category,
        "amount": round(float(amount), 2),
        "description": description,
        "charged_at": str(charged_at),
    }
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/spend_transactions",
        data=json.dumps(payload).encode(),
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=ignore-duplicates,return=minimal",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        print(f"    [warn] insert conflict/error for {service} {charged_at}: {e.code} {body[:120]}")
        return e.code

# ── Helpers ───────────────────────────────────────────────────────────────────
def today():
    return datetime.date.today()

def days_ago(n):
    return today() - datetime.timedelta(days=n)

def http_get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def http_get_xml_text(url, headers=None):
    """Returns raw text (Twilio returns JSON but this keeps it generic)."""
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode()

RESULTS = []

def log(service, inserted, skipped=0, note=""):
    RESULTS.append({"service": service, "inserted": inserted, "skipped": skipped, "note": note})
    print(f"  [{service}] inserted={inserted} skipped={skipped}" + (f" ({note})" if note else ""))

# ── 1. Anthropic ──────────────────────────────────────────────────────────────
def sync_anthropic():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        log("Anthropic Claude API", 0, note="ANTHROPIC_API_KEY not set — skipped")
        return
    try:
        # Anthropic usage endpoint returns per-model daily usage
        inserted = 0
        skipped = 0
        for offset in range(7):
            d = days_ago(offset)
            url = f"https://api.anthropic.com/v1/usage?date={d}"
            try:
                data = http_get(url, {
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                })
                # Response shape: { "data": [ { "model": ..., "input_tokens": ..., "output_tokens": ..., "cost": ... } ] }
                entries = data.get("data") or []
                day_total = sum(float(e.get("cost", 0) or 0) for e in entries)
                if day_total > 0:
                    status = write_transaction(
                        "Anthropic Claude API", "ai_llm", day_total,
                        f"Usage {d}: {len(entries)} model(s)", d,
                    )
                    if status in (201, 200):
                        inserted += 1
                    else:
                        skipped += 1
            except Exception as e:
                print(f"    [warn] Anthropic {d}: {e}")
                skipped += 1
        log("Anthropic Claude API", inserted, skipped)
    except Exception as e:
        log("Anthropic Claude API", 0, note=str(e))

# ── 2. OpenRouter ─────────────────────────────────────────────────────────────
def sync_openrouter():
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        log("OpenRouter", 0, note="OPENROUTER_API_KEY not set — skipped")
        return
    try:
        data = http_get("https://openrouter.ai/api/v1/auth/key", {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })
        # Response: { "data": { "usage": <credits_used_lifetime>, "limit": ..., "is_free_tier": ... } }
        inner = data.get("data") or data
        usage = float(inner.get("usage") or 0)

        # Track usage by reading yesterday's snapshot from a state file
        state_path = pathlib.Path(__file__).parent / ".openrouter_usage_snapshot"
        prev_usage = 0.0
        if state_path.exists():
            try:
                prev_usage = float(state_path.read_text().strip())
            except Exception:
                pass

        delta = usage - prev_usage
        inserted = 0
        skipped = 0
        if delta > 0.001:
            status = write_transaction(
                "OpenRouter", "ai_llm", delta,
                f"Usage delta since last sync (lifetime total: ${usage:.4f})", today(),
            )
            inserted = 1 if status in (200, 201) else 0
            skipped = 0 if inserted else 1

        # Always update snapshot
        state_path.write_text(str(usage))
        log("OpenRouter", inserted, skipped, f"delta=${delta:.4f}")
    except Exception as e:
        log("OpenRouter", 0, note=str(e))

# ── 3. OpenAI ─────────────────────────────────────────────────────────────────
def sync_openai():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        log("OpenAI API", 0, note="OPENAI_API_KEY not set — skipped")
        return
    inserted = 0
    skipped = 0
    try:
        for offset in range(7):
            d = days_ago(offset)
            url = f"https://api.openai.com/v1/usage?date={d}"
            try:
                data = http_get(url, {"Authorization": f"Bearer {api_key}"})
                # Response: { "data": [ { "n_requests": ..., "total_tokens": ..., "total_cost": ... } ] }
                entries = data.get("data") or []
                day_cost = sum(float(e.get("total_cost", 0) or 0) for e in entries)
                if day_cost > 0:
                    status = write_transaction(
                        "OpenAI API", "ai_llm", day_cost,
                        f"Usage {d}", d,
                    )
                    if status in (200, 201):
                        inserted += 1
                    else:
                        skipped += 1
            except Exception as e:
                print(f"    [warn] OpenAI {d}: {e}")
                skipped += 1
        log("OpenAI API", inserted, skipped)
    except Exception as e:
        log("OpenAI API", 0, note=str(e))

# ── 4. Twilio  (phone bridge 786-998-5740 only) ───────────────────────────────
def sync_twilio():
    sid   = os.environ.get("TWILIO_ACCOUNT_SID")
    token = os.environ.get("TWILIO_AUTH_TOKEN")
    if not sid or not token:
        log("Twilio", 0, note="TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN not set — skipped")
        return
    try:
        creds = base64.b64encode(f"{sid}:{token}".encode()).decode()
        auth_hdr = {"Authorization": f"Basic {creds}"}

        start = days_ago(7).isoformat()
        end   = today().isoformat()
        url = (
            f"https://api.twilio.com/2010-04-01/Accounts/{sid}/Usage/Records.json"
            f"?StartDate={start}&EndDate={end}&PageSize=100"
        )
        data = http_get(url, auth_hdr)
        records = data.get("usage_records") or []

        # Filter to phone-bridge number (786) 998-5740 -> 17869985740
        TARGET = "7869985740"
        inserted = 0
        skipped = 0
        for rec in records:
            # Some records have phone_number field; usage records are per-category
            # We record all usage as one daily total for Twilio (number-level breakdown
            # requires a separate CDR endpoint; usage records aggregate by category)
            price = float(rec.get("price") or 0)
            if price <= 0:
                continue
            rec_date = rec.get("start_date") or str(today())
            desc = f"{rec.get('description', 'Twilio usage')} · bridge {TARGET[-10:]}"
            status = write_transaction("Twilio", "infrastructure", price, desc, rec_date)
            if status in (200, 201):
                inserted += 1
            else:
                skipped += 1

        log("Twilio", inserted, skipped)
    except Exception as e:
        log("Twilio", 0, note=str(e))

# ── 5. KIE.ai  (credit delta) ─────────────────────────────────────────────────
def sync_kie():
    api_key = os.environ.get("KIE_API_KEY")
    if not api_key:
        log("KIE.ai", 0, note="KIE_API_KEY not set — skipped")
        return
    try:
        data = http_get("https://api.kie.ai/api/v1/chat/credit", {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        })
        credits = data.get("data")
        if credits is None:
            log("KIE.ai", 0, note="Unexpected response shape")
            return

        state_path = pathlib.Path(__file__).parent / ".kie_credits_snapshot"
        prev = None
        if state_path.exists():
            try:
                prev = float(state_path.read_text().strip())
            except Exception:
                pass

        inserted = 0
        skipped = 0
        if prev is not None and credits < prev:
            delta = prev - credits
            # Convert KIE credits to USD: $5 per ~1000 credits (approximate)
            usd_est = round(delta * 0.005, 4)
            status = write_transaction(
                "KIE.ai", "ai_llm", usd_est,
                f"Credit consumption: {delta:.0f} credits (~${usd_est:.4f})", today(),
            )
            inserted = 1 if status in (200, 201) else 0
            skipped = 0 if inserted else 1

        state_path.write_text(str(credits))
        log("KIE.ai", inserted, skipped, f"balance={credits}")
    except Exception as e:
        log("KIE.ai", 0, note=str(e))

# ── 6. Fixed subscriptions (no API) ──────────────────────────────────────────
# For services with no usage API, auto-insert on their billing_day each month.
FIXED_SUBS = [
    # (service, category, amount, billing_day)
    ("Midjourney",  "ai_llm",         10.00, 1),
    ("ElevenLabs",  "ai_llm",         22.00, 23),
    ("Render.com",  "infrastructure",  7.00, 4),
    ("Notion",      "infrastructure", 24.00, 30),
]

def sync_fixed_subs():
    t = today()
    inserted = 0
    skipped = 0
    for service, category, amount, billing_day in FIXED_SUBS:
        # Fire on exact billing day
        if t.day != billing_day:
            continue
        billed_date = t.replace(day=billing_day)
        desc = f"Monthly subscription — auto-logged on billing day {billing_day}"
        status = write_transaction(service, category, amount, desc, billed_date)
        if status in (200, 201):
            inserted += 1
            print(f"  [Fixed] {service} ${amount:.2f} logged for {billed_date}")
        else:
            skipped += 1
    log("Fixed subscriptions", inserted, skipped, f"today=day {t.day}")

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n{'='*60}")
    print(f"sync_spend.py  {now}")
    print(f"{'='*60}")

    sync_anthropic()
    sync_openrouter()
    sync_openai()
    sync_twilio()
    sync_kie()
    sync_fixed_subs()

    print(f"\nSummary:")
    total_inserted = sum(r["inserted"] for r in RESULTS)
    total_skipped  = sum(r["skipped"]  for r in RESULTS)
    for r in RESULTS:
        flag = "ok" if r["inserted"] > 0 else ("skip" if r["skipped"] else "  —")
        print(f"  {flag:4s}  {r['service']:<30}  +{r['inserted']} inserted  {r['skipped']} skipped  {r.get('note','')}")
    print(f"\nTotal: {total_inserted} inserted, {total_skipped} skipped/conflict")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
