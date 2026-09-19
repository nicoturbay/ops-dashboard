import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/spend/sync
 *
 * Triggers a server-side spend sync.  The heavy work (scraping PDFs, hitting
 * billing APIs, etc.) runs as an external cron script that writes directly to
 * Supabase.  This endpoint exists so the dashboard UI can request an
 * on-demand refresh and get a structured JSON response back.
 *
 * If you have a sync worker URL, set SPEND_SYNC_WORKER_URL in env and this
 * route will proxy the request there.  Otherwise it returns a stub success so
 * the UI's grand total re-fetch still fires after the button click.
 */
export async function POST() {
  const workerUrl = process.env.SPEND_SYNC_WORKER_URL;

  if (workerUrl) {
    try {
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trigger: 'manual' }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => 'unknown error');
        return NextResponse.json({ ok: false, error: text }, { status: 502 });
      }
      const body = await res.json().catch(() => ({ inserted: 0 }));
      return NextResponse.json({ ok: true, inserted: body.inserted ?? body.count ?? 0 });
    } catch (err) {
      return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
    }
  }

  // No worker configured — return stub so the UI re-fetches cleanly.
  return NextResponse.json({ ok: true, inserted: 0, note: 'No sync worker configured. Data comes from external cron script.' });
}
