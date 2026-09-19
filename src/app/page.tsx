'use client';
import { useState, useEffect, useCallback } from 'react';
import CRTOverlay from '@/components/CRTOverlay';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { ServiceSubscription } from '@/types/activity';

// ─── helpers ────────────────────────────────────────────────────────────────

function usd(n: number | null | undefined) {
  if (n == null) return 'N/A';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

// ─── Hamburger Nav ──────────────────────────────────────────────────────────

function HamburgerNav() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          fontSize: 18,
          color: '#00FF66',
          background: 'transparent',
          border: '1px solid #333',
          padding: '4px 10px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          lineHeight: 1,
          letterSpacing: 0,
        }}
        aria-label="Open navigation menu"
      >
        ☰
      </button>
      {open && (
        <>
          {/* backdrop to close */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          />
          <div style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            background: '#0a0a10',
            border: '1px solid #00FF66',
            boxShadow: '0 0 20px rgba(0,255,102,0.3)',
            zIndex: 1000,
            minWidth: 260,
            padding: '8px 0',
          }}>
            <a
              href="/"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: '#00FF66',
                fontSize: 9,
                fontFamily: '"Press Start 2P", cursive',
                letterSpacing: 1,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid #111',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.textShadow = '0 0 8px #00FF66'; (e.target as HTMLElement).style.background = '#111'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.textShadow = 'none'; (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              [ SPEND CONTROL ]
            </a>
            <a
              href="/hq"
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: '#fff',
                fontSize: 9,
                fontFamily: '"Press Start 2P", cursive',
                letterSpacing: 1,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.textShadow = '0 0 8px #fff'; (e.target as HTMLElement).style.background = '#111'; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.textShadow = 'none'; (e.target as HTMLElement).style.background = 'transparent'; }}
            >
              [ MISSION CONTROL ]
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Live Balances inside Burn section ──────────────────────────────────────

interface CreditsData {
  kie:        { credits: number; live: boolean };
  higgsfield: { monthly: number };
  twilio:     { balance: number; live: boolean; phone: string };
}

function LiveBalanceCards() {
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
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
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
            <div style={{ color: '#fff', fontSize: 7, letterSpacing: 1, lineHeight: 1.5 }}>{sub.service}</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 6, fontFamily: '"Press Start 2P", cursive',
                color: catColor(sub.category), border: `1px solid ${catColor(sub.category)}`,
                padding: '2px 5px', letterSpacing: 1, whiteSpace: 'nowrap',
              }}>
                {catLabel(sub.category)}
              </span>
              <span style={{
                fontSize: 6, fontFamily: '"Press Start 2P", cursive',
                color: billingColor(sub.billing_type), border: `1px solid ${billingColor(sub.billing_type)}`,
                padding: '2px 5px', letterSpacing: 1, whiteSpace: 'nowrap',
              }}>
                {sub.billing_type.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: 16, color: '#00CC44', textShadow: '0 0 10px #00CC4466', fontVariantNumeric: 'tabular-nums', letterSpacing: 2 }}>
              {sub.monthly_cost != null ? usd(sub.monthly_cost) : 'CREDIT-BASED'}
            </div>
            <div style={{ color: '#444', fontSize: 6, letterSpacing: 1 }}>
              {sub.billing_day ? `BILLS DAY ${sub.billing_day}` : 'VARIABLE'}
            </div>
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

// ─── main page ──────────────────────────────────────────────────────────────

export default function SpendPage() {
  const [subs, setSubs]       = useState<ServiceSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // Initial load — subscriptions only
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const db = getSupabaseClient();
    db.from('service_subscriptions')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('service')
      .then(({ data: s }) => {
        setSubs((s as ServiceSubscription[]) ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Sync handler — syncs live balances (KIE, Twilio)
  async function handleSync() {
    setSyncing(true);
    setSyncMsg('');
    try {
      const res = await fetch('/api/spend/sync', { method: 'POST' });
      setSyncMsg(res.ok ? 'SYNCED' : 'SYNC FAILED');
    } catch {
      setSyncMsg('SYNC FAILED');
    } finally {
      setSyncing(false);
    }
  }

  // Estimated monthly burn from active subscriptions with known cost
  const burnTotal = subs.filter(s => s.active && s.monthly_cost != null).reduce((s, x) => s + Number(x.monthly_cost ?? 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      fontFamily: '"Press Start 2P", cursive',
      color: '#fff',
      position: 'relative',
      paddingBottom: 40,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <CRTOverlay />

      {/* ── Header ── */}
      <header style={{
        padding: '16px 32px 14px',
        borderBottom: '1px solid #111',
        background: '#000',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Left: Sync button */}
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
          {syncMsg && (
            <span style={{ color: syncMsg.includes('FAIL') ? '#ff4444' : '#00CC44', fontSize: 6, letterSpacing: 2 }}>
              {syncMsg}
            </span>
          )}
        </div>

        {/* Center: Page title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(10px, 1.6vw, 18px)', color: '#fff', letterSpacing: '6px', marginBottom: 4, textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
            SPEND CONTROL
          </h1>
          <p style={{ color: '#00CC44', fontSize: 7, letterSpacing: '2px', textShadow: '0 0 8px #00CC44' }}>
            [ SERVICES &amp; SUBSCRIPTIONS DASHBOARD ]
          </p>
        </div>

        {/* Right: Hamburger */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <HamburgerNav />
        </div>
      </header>

      {/* ── EST. MONTHLY BURN hero ── */}
      <div style={{
        background: '#020206',
        borderBottom: '1px solid #1a1a1a',
        padding: '40px 32px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ color: '#444', fontSize: 7, letterSpacing: 4, marginBottom: 16 }}>EST. MONTHLY BURN</div>
        <div style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          color: '#00FF66',
          textShadow: '0 0 20px #00FF66, 0 0 40px #00CC4499, 0 0 80px #00CC4433',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: 6,
          lineHeight: 1,
        }}>
          {loading ? '...' : usd(burnTotal)}
        </div>
        <div style={{ color: '#333', fontSize: 6, letterSpacing: 3, marginTop: 14 }}>
          TRACKED ACROSS 14 SERVICES · VARIABLE SPEND ESTIMATED
        </div>

        {/* Live balance cards */}
        <LiveBalanceCards />
      </div>

      {/* ── Body ── */}
      <main style={{ padding: '28px 32px 0', maxWidth: 1100, margin: '0 auto' }}>
        {loading ? (
          <div style={{ color: '#333', fontSize: 8, letterSpacing: 3, marginTop: 40 }}>LOADING...</div>
        ) : (
          <>
            {/* Services */}
            <ServiceCardsSection subs={subs} />

            {/* Service Ledger */}
            <SubscriptionsSection subs={subs} />
          </>
        )}
      </main>
    </div>
  );
}
