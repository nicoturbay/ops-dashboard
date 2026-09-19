'use client';
import { useState, useEffect, useCallback } from 'react';
import CRTOverlay from '@/components/CRTOverlay';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { SpendTransaction, ServiceSubscription } from '@/types/activity';

// ─── helpers ────────────────────────────────────────────────────────────────

function usd(n: number | null | undefined) {
  if (n == null) return 'N/A';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
}

const PERIODS: { label: string; days: number }[] = [
  { label: '7D',  days: 7  },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

// ─── sub-components ─────────────────────────────────────────────────────────

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 6,
      fontFamily: '"Press Start 2P", cursive',
      color,
      border: `1px solid ${color}`,
      padding: '2px 5px',
      letterSpacing: 1,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

interface CreditsData {
  kie:        { credits: number; live: boolean };
  higgsfield: { monthly: number };
  twilio:     { balance: number; live: boolean; phone: string };
}

function CreditsSection() {
  const [data, setData] = useState<CreditsData | null>(null);

  useEffect(() => {
    fetch('/api/spend/credits').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const card: React.CSSProperties = {
    background: '#0a0a10',
    border: '1px solid #222',
    padding: '16px 20px',
    flex: 1,
    minWidth: 200,
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#888', fontSize: 8, letterSpacing: 3, marginBottom: 12 }}>[ LIVE BALANCES ]</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

        <div style={card}>
          <div style={{ color: '#555', fontSize: 7, letterSpacing: 2, marginBottom: 8 }}>KIE.AI</div>
          <div style={{ fontSize: 20, color: '#00CC44', textShadow: '0 0 12px #00CC4488', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>
            {data ? data.kie.credits.toLocaleString() : '...'}
          </div>
          <div style={{ color: '#444', fontSize: 6, letterSpacing: 1 }}>
            {data?.kie.live ? '● LIVE CREDITS' : '● CACHED'}
          </div>
        </div>

        <div style={card}>
          <div style={{ color: '#555', fontSize: 7, letterSpacing: 2, marginBottom: 8 }}>HIGGSFIELD</div>
          <div style={{ fontSize: 14, color: '#FF6B00', textShadow: '0 0 10px #FF6B0066', marginBottom: 6 }}>
            {data ? usd(data.higgsfield.monthly) : '...'}/MO
          </div>
          <div style={{ color: '#444', fontSize: 6, letterSpacing: 1 }}>CREDITS PLAN — NO API</div>
        </div>

        <div style={card}>
          <div style={{ color: '#555', fontSize: 7, letterSpacing: 2, marginBottom: 8 }}>TWILIO</div>
          <div style={{ fontSize: 20, color: '#8CA4FF', textShadow: '0 0 12px #8CA4FF55', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>
            {data ? usd(data.twilio.balance) : '...'}
          </div>
          <div style={{ color: '#444', fontSize: 6, letterSpacing: 1, marginBottom: 8 }}>
            {data?.twilio.live ? '● LIVE BALANCE' : '● CACHED'}
          </div>
          <div style={{ color: '#555', fontSize: 6, letterSpacing: 1 }}>PHONE BRIDGE</div>
          <div style={{ color: '#8CA4FF', fontSize: 6, letterSpacing: 1, marginTop: 2 }}>
            {data?.twilio.phone ?? '(786) 998-5740'}
          </div>
        </div>

      </div>
    </section>
  );
}


function ServiceCardsSection({ subs }: { subs: ServiceSubscription[] }) {
  if (subs.length === 0) return null;

  const catColor = (cat: string) => cat === 'ai_llm' ? '#FF6B00' : '#4963f5';
  const catLabel = (cat: string) => cat === 'ai_llm' ? 'AI/LLM' : 'INFRA';
  const billingColor = (bt: string) => bt === 'subscription' ? '#00CC44' : bt === 'credits' ? '#FF1493' : '#FF8A3D';

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#888', fontSize: 8, letterSpacing: 3, marginBottom: 12 }}>[ SERVICES ]</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {subs.map(sub => (
          <div
            key={sub.id}
            style={{
              background: '#0a0a10',
              border: '1px solid #222',
              padding: 16,
              minWidth: 180,
              maxWidth: 220,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'border-color 0.15s',
              cursor: 'default',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00FF66'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 10px #00FF6633'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#222'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
          >
            {/* Service name */}
            <div style={{ color: '#fff', fontSize: 7, letterSpacing: 1, lineHeight: 1.5 }}>{sub.service}</div>

            {/* Category + billing type pills */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 6,
                fontFamily: '"Press Start 2P", cursive',
                color: catColor(sub.category),
                border: `1px solid ${catColor(sub.category)}`,
                padding: '2px 5px',
                letterSpacing: 1,
                whiteSpace: 'nowrap',
              }}>
                {catLabel(sub.category)}
              </span>
              <span style={{
                fontSize: 6,
                fontFamily: '"Press Start 2P", cursive',
                color: billingColor(sub.billing_type),
                border: `1px solid ${billingColor(sub.billing_type)}`,
                padding: '2px 5px',
                letterSpacing: 1,
                whiteSpace: 'nowrap',
              }}>
                {sub.billing_type.toUpperCase()}
              </span>
            </div>

            {/* Monthly cost */}
            <div style={{
              fontSize: 16,
              color: '#00CC44',
              textShadow: '0 0 10px #00CC4466',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 2,
            }}>
              {sub.monthly_cost != null ? usd(sub.monthly_cost) : 'CREDIT-BASED'}
            </div>

            {/* Bill day */}
            <div style={{ color: '#444', fontSize: 6, letterSpacing: 1 }}>
              {sub.billing_day ? `BILLS DAY ${sub.billing_day}` : 'VARIABLE'}
            </div>

            {/* Notes */}
            {sub.notes && (
              <div style={{ color: '#333', fontSize: 6, letterSpacing: 1, lineHeight: 1.6, marginTop: 2 }}>
                {sub.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SubscriptionsSection({ subs }: { subs: ServiceSubscription[] }) {
  const aiSubs    = subs.filter(s => s.category === 'ai_llm');
  const infraSubs = subs.filter(s => s.category === 'infrastructure');

  const rowStyle = (cat: string): React.CSSProperties => ({
    color: cat === 'ai_llm' ? '#FF8A3D' : '#8CA4FF',
    fontSize: 7,
    letterSpacing: 1,
    borderBottom: '1px solid #111',
  });
  const td: React.CSSProperties = { padding: '8px 10px', whiteSpace: 'nowrap' };
  const th: React.CSSProperties = {
    padding: '8px 10px', color: '#444', fontSize: 6, letterSpacing: 2,
    fontWeight: 'normal', borderBottom: '1px solid #222', whiteSpace: 'nowrap', textAlign: 'left' as const,
  };

  const rows = (list: ServiceSubscription[]) => list.map(sub => (
    <tr key={sub.id} style={rowStyle(sub.category)}>
      <td style={td}>{sub.service}</td>
      <td style={td}>
        <Pill label={sub.category === 'ai_llm' ? 'AI/LLM' : 'INFRA'} color={sub.category === 'ai_llm' ? '#FF6B00' : '#4963f5'} />
      </td>
      <td style={td}>
        <Pill
          label={sub.billing_type.toUpperCase()}
          color={sub.billing_type === 'subscription' ? '#00CC44' : sub.billing_type === 'credits' ? '#FF1493' : '#888'}
        />
      </td>
      <td style={{ ...td, color: '#00CC44', textShadow: '0 0 8px #00CC4455', fontVariantNumeric: 'tabular-nums' }}>
        {sub.monthly_cost != null ? usd(sub.monthly_cost) : '—'}
      </td>
      <td style={{ ...td, color: '#444', fontSize: 6 }}>{sub.billing_day ? `Day ${sub.billing_day}` : '—'}</td>
      <td style={{ ...td, color: '#444', fontSize: 6, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.notes ?? '—'}</td>
    </tr>
  ));

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#888', fontSize: 8, letterSpacing: 3, marginBottom: 12 }}>[ SERVICE LEDGER ]</h2>
      <div style={{ background: '#0a0a10', border: '1px solid #222', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Press Start 2P", cursive' }}>
          <thead>
            <tr>
              <th style={th}>SERVICE</th>
              <th style={th}>CAT</th>
              <th style={th}>TYPE</th>
              <th style={th}>MO. COST</th>
              <th style={th}>BILL DAY</th>
              <th style={th}>NOTES</th>
            </tr>
          </thead>
          <tbody>{rows([...aiSubs, ...infraSubs])}</tbody>
        </table>
      </div>
    </section>
  );
}

function SpendFeed({ txns, periodLabel }: { txns: SpendTransaction[]; periodLabel: string }) {
  const total = txns.reduce((s, t) => s + Number(t.amount), 0);
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#888', fontSize: 8, letterSpacing: 3, marginBottom: 12 }}>
        [ RECENT CHARGES — {periodLabel} ]
      </h2>
      <div style={{ background: '#0a0a10', border: '1px solid #222', padding: '0 0 12px' }}>
        {txns.length === 0 ? (
          <div style={{ padding: 20, color: '#333', fontSize: 7, letterSpacing: 2 }}>NO TRANSACTIONS YET — SYNC SCRIPT POPULATES THIS</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Press Start 2P", cursive' }}>
            <thead>
              <tr>
                {['DATE', 'SERVICE', 'AMOUNT', 'DESCRIPTION'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', color: '#444', fontSize: 6, letterSpacing: 2, fontWeight: 'normal', borderBottom: '1px solid #222', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {txns.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '7px 10px', color: '#555', fontSize: 6, whiteSpace: 'nowrap' }}>{t.charged_at}</td>
                  <td style={{ padding: '7px 10px', color: '#FF8A3D', fontSize: 7 }}>{t.service}</td>
                  <td style={{ padding: '7px 10px', color: '#00CC44', fontSize: 7, textShadow: '0 0 8px #00CC4455', fontVariantNumeric: 'tabular-nums' }}>{usd(Number(t.amount))}</td>
                  <td style={{ padding: '7px 10px', color: '#444', fontSize: 6 }}>{t.description ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {txns.length > 0 && (
          <div style={{ padding: '12px 10px 0', textAlign: 'right', color: '#00CC44', fontSize: 8, textShadow: '0 0 10px #00CC44' }}>
            TOTAL: {usd(total)}
          </div>
        )}
      </div>
    </section>
  );
}

function BurnEstimate({ subs }: { subs: ServiceSubscription[] }) {
  const total = subs.filter(s => s.active && s.monthly_cost != null).reduce((s, x) => s + Number(x.monthly_cost ?? 0), 0);
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ color: '#888', fontSize: 8, letterSpacing: 3, marginBottom: 12 }}>[ EST. MONTHLY BURN ]</h2>
      <div style={{ background: '#0a0a10', border: '1px solid #222', padding: '20px 24px', display: 'inline-block' }}>
        <div style={{ fontSize: 28, color: '#00CC44', textShadow: '0 0 20px #00CC44, 0 0 40px #00CC4466', fontVariantNumeric: 'tabular-nums', letterSpacing: 4 }}>
          {usd(total)}
        </div>
        <div style={{ color: '#333', fontSize: 6, letterSpacing: 2, marginTop: 8 }}>TRACKED SERVICES · VARIABLE SPEND ESTIMATED</div>
      </div>
    </section>
  );
}

// ─── main page ──────────────────────────────────────────────────────────────

export default function SpendPage() {
  const [subs, setSubs]           = useState<ServiceSubscription[]>([]);
  const [txns, setTxns]           = useState<SpendTransaction[]>([]);
  const [loading, setLoading]     = useState(true);
  const [periodIdx, setPeriodIdx] = useState(1);          // default: 30D
  const [syncing, setSyncing]     = useState(false);
  const [syncMsg, setSyncMsg]     = useState('');

  const period = PERIODS[periodIdx];

  const fetchTxns = useCallback((days: number) => {
    if (!isSupabaseConfigured) return;
    const db = getSupabaseClient();
    db.from('spend_transactions')
      .select('*')
      .gte('charged_at', daysAgoIso(days))
      .order('charged_at', { ascending: false })
      .then(({ data: t }) => setTxns((t as SpendTransaction[]) ?? []));
  }, []);

  // Initial load
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const db = getSupabaseClient();
    Promise.all([
      db.from('service_subscriptions').select('*').eq('active', true).order('category').order('service'),
      db.from('spend_transactions')
        .select('*')
        .gte('charged_at', daysAgoIso(period.days))
        .order('charged_at', { ascending: false }),
    ]).then(([{ data: s }, { data: t }]) => {
      setSubs((s as ServiceSubscription[]) ?? []);
      setTxns((t as SpendTransaction[]) ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch transactions whenever period changes (after initial load)
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) { setInitialized(true); return; }
    fetchTxns(period.days);
  }, [periodIdx, fetchTxns, initialized]);

  // Sync handler
  async function handleSync() {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await fetch('/api/spend/sync', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      setSyncMsg(res.ok ? `SYNCED — ${body.inserted ?? 0} NEW RECORDS` : 'SYNC FAILED');
      if (res.ok) fetchTxns(period.days);
    } catch {
      setSyncMsg('SYNC FAILED');
    } finally {
      setSyncing(false);
    }
  }

  // Grand total of currently visible transactions
  const grandTotal = txns.reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#050508', fontFamily: '"Press Start 2P", cursive', color: '#fff', position: 'relative', paddingBottom: 40 }}>
      <CRTOverlay />

      {/* ── Header ── */}
      <header style={{ padding: '16px 32px 14px', borderBottom: '1px solid #111', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(10px, 1.6vw, 18px)', color: '#fff', letterSpacing: '6px', marginBottom: 4, textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
            SPEND CONTROL
          </h1>
          <p style={{ color: '#00CC44', fontSize: 7, letterSpacing: '2px', textShadow: '0 0 8px #00CC44' }}>
            [ SERVICES &amp; SUBSCRIPTIONS DASHBOARD ]
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              fontSize: 7, fontFamily: '"Press Start 2P", cursive',
              color: syncing ? '#444' : '#FF6B00',
              border: `1px solid ${syncing ? '#333' : '#FF6B00'}`,
              background: 'transparent', padding: '6px 10px',
              cursor: syncing ? 'not-allowed' : 'pointer', letterSpacing: 2,
            }}
          >
            {syncing ? '[ SYNCING... ]' : '[ SYNC NOW ]'}
          </button>
          <a href='/hq'
            style={{ display: 'inline-block', fontSize: 7, color: '#555', border: '1px solid #333', padding: '6px 10px', textDecoration: 'none', letterSpacing: 2 }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.borderColor = '#fff'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#555'; (e.target as HTMLElement).style.borderColor = '#333'; }}
          >
            [ MISSION CTRL ]
          </a>
        </div>
      </header>

      {/* ── Grand Total Banner ── */}
      <div style={{
        background: '#020206',
        borderBottom: '1px solid #1a1a1a',
        padding: '28px 32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        {/* Period toggle */}
        <div style={{ display: 'flex', gap: 8 }}>
          {PERIODS.map((p, i) => {
            const active = i === periodIdx;
            return (
              <button
                key={p.label}
                onClick={() => setPeriodIdx(i)}
                style={{
                  fontSize: 7,
                  fontFamily: '"Press Start 2P", cursive',
                  color: active ? '#000' : '#555',
                  background: active ? '#FF6B00' : 'transparent',
                  border: `1px solid ${active ? '#FF6B00' : '#333'}`,
                  padding: '5px 14px',
                  cursor: 'pointer',
                  letterSpacing: 2,
                  boxShadow: active ? '0 0 12px #FF6B0066' : 'none',
                  transition: 'all 0.1s',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* The dominant number */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#333', fontSize: 7, letterSpacing: 4, marginBottom: 10 }}>TOTAL SPEND</div>
          <div style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: '#00FF66',
            textShadow: '0 0 20px #00FF66, 0 0 40px #00CC4499, 0 0 80px #00CC4433',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: 6,
            lineHeight: 1,
          }}>
            {loading ? '...' : usd(grandTotal)}
          </div>
          <div style={{ color: '#444', fontSize: 6, letterSpacing: 3, marginTop: 10 }}>
            LAST {period.label === '7D' ? '7' : period.label === '30D' ? '30' : '90'} DAYS
          </div>
          {syncMsg && (
            <div style={{ color: syncMsg.includes('FAIL') ? '#ff4444' : '#00CC44', fontSize: 6, letterSpacing: 2, marginTop: 8 }}>
              {syncMsg}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <main style={{ padding: '28px 32px 0', maxWidth: 1100, margin: '0 auto' }}>
        {loading ? (
          <div style={{ color: '#333', fontSize: 8, letterSpacing: 3, marginTop: 40 }}>LOADING...</div>
        ) : (
          <>
            <CreditsSection />
            <BurnEstimate subs={subs} />
            <ServiceCardsSection subs={subs} />
            <SubscriptionsSection subs={subs} />
            <SpendFeed txns={txns} periodLabel={`LAST ${period.days}D`} />
          </>
        )}
      </main>
    </div>
  );
}
