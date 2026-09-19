import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Try KIE.ai API — endpoint: /api/v1/chat/credit
  const kieKey = process.env.KIE_API_KEY;
  let kieCredits: number | null = null;

  if (kieKey) {
    try {
      const res = await fetch('https://api.kie.ai/api/v1/chat/credit', {
        headers: { 'Authorization': `Bearer ${kieKey}`, 'Content-Type': 'application/json' },
        next: { revalidate: 300 },
      });
      if (res.ok) {
        const data = await res.json();
        // KIE returns { code: 200, data: <number> }
        const raw = data?.data ?? data?.credits ?? data?.balance ?? null;
        kieCredits = typeof raw === 'number' ? raw : null;
      }
    } catch {
      // silently fall back to default
    }
  }

  return NextResponse.json({
    kie: {
      credits: kieCredits ?? 1072,
      label: 'KIE.ai Credits',
      live: kieCredits !== null,
    },
    higgsfield: {
      credits: null,
      label: 'Higgsfield Credits',
      monthly: 59,
      note: 'Manual check required',
      live: false,
    },
  });
}
