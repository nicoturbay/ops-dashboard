import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function upsertTransaction(service: string, category: string, amount: number, description: string, charged_at: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/spend_transactions`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ service, category, amount, description, charged_at }),
  });
  return res.status === 201;
}

function fmt(d: Date) { return d.toISOString().split('T')[0]; }

export async function POST() {
  const results: Record<string, string> = {};
  let totalInserted = 0;
  const today = new Date();

  // --- Anthropic ---
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (key) {
      let inserted = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(today.getTime() - i * 86400000);
        const dateStr = fmt(d);
        try {
          const res = await fetch(`https://api.anthropic.com/v1/organizations/usage?start_time=${dateStr}T00:00:00Z&end_time=${dateStr}T23:59:59Z&granularity=day`, {
            headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'usage-2023-11-01' }
          });
          if (res.ok) {
            const data = await res.json();
            const cost = data.data?.[0]?.total_cost ?? 0;
            if (cost > 0) {
              const ok = await upsertTransaction('Anthropic Claude API', 'ai_llm', cost, `API usage ${dateStr}`, dateStr);
              if (ok) { inserted++; totalInserted++; }
            }
          }
        } catch {}
      }
      results.anthropic = `${inserted} days inserted`;
    } else { results.anthropic = 'no key'; }
  } catch (e) { results.anthropic = `error: ${e}`; }

  // --- OpenAI ---
  try {
    const key = process.env.OPENAI_API_KEY;
    if (key) {
      let inserted = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(today.getTime() - i * 86400000);
        const dateStr = fmt(d);
        try {
          const res = await fetch(`https://api.openai.com/v1/usage?date=${dateStr}`, {
            headers: { 'Authorization': `Bearer ${key}` }
          });
          if (res.ok) {
            const data = await res.json();
            const costCents = data.total_usage ?? 0;
            const cost = costCents / 100;
            if (cost > 0) {
              const ok = await upsertTransaction('OpenAI API', 'ai_llm', cost, `API usage ${dateStr}`, dateStr);
              if (ok) { inserted++; totalInserted++; }
            }
          }
        } catch {}
      }
      results.openai = `${inserted} days inserted`;
    } else { results.openai = 'no key'; }
  } catch (e) { results.openai = `error: ${e}`; }

  // --- OpenRouter ---
  try {
    const key = process.env.OPENROUTER_API_KEY;
    if (key) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
          headers: { 'Authorization': `Bearer ${key}` }
        });
        if (res.ok) {
          const data = await res.json();
          const usage = parseFloat(data.data?.usage ?? '0');
          // OpenRouter doesn't expose per-day breakdown via API key endpoint
          // Record current total usage as a snapshot
          if (usage > 0) {
            const dateStr = fmt(today);
            const ok = await upsertTransaction('OpenRouter', 'ai_llm', usage, `Lifetime usage snapshot ${dateStr}`, dateStr);
            if (ok) { totalInserted++; results.openrouter = `snapshot $${usage} inserted`; }
            else { results.openrouter = `snapshot $${usage} (already exists)`; }
          } else {
            results.openrouter = 'usage $0';
          }
        }
      } catch {}
    } else { results.openrouter = 'no key'; }
  } catch (e) { results.openrouter = `error: ${e}`; }

  // --- Twilio ---
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (sid && token) {
      const creds = Buffer.from(`${sid}:${token}`).toString('base64');
      const start = fmt(new Date(today.getTime() - 30 * 86400000));
      const end = fmt(today);
      try {
        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${sid}/Usage/Records.json?StartDate=${start}&EndDate=${end}&Category=totalprice`,
          { headers: { 'Authorization': `Basic ${creds}` } }
        );
        if (res.ok) {
          const data = await res.json();
          const records = data.usage_records ?? [];
          let inserted = 0;
          for (const rec of records) {
            const price = parseFloat(rec.price ?? '0');
            if (price > 0) {
              const ok = await upsertTransaction('Twilio', 'infrastructure', price, `Phone usage ${rec.start_date} to ${rec.end_date}`, rec.end_date ?? end);
              if (ok) { inserted++; totalInserted++; }
            }
          }
          results.twilio = `${inserted} records inserted`;
        }
      } catch {}
    } else { results.twilio = 'no credentials'; }
  } catch (e) { results.twilio = `error: ${e}`; }

  return NextResponse.json({
    ok: true,
    synced_at: new Date().toISOString(),
    inserted: totalInserted,
    results,
  });
}
