import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // ── KIE.ai ────────────────────────────────────────────────────────────────
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
        const raw = data?.data ?? data?.credits ?? data?.balance ?? null;
        kieCredits = typeof raw === 'number' ? raw : null;
      }
    } catch { /* fall back */ }
  }

  // ── Twilio ────────────────────────────────────────────────────────────────
  const twilioSid   = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  let twilioBalance: number | null = null;

  if (twilioSid && twilioToken) {
    try {
      const creds = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Balance.json`,
        { headers: { Authorization: `Basic ${creds}` }, next: { revalidate: 300 } }
      );
      if (res.ok) {
        const data = await res.json();
        twilioBalance = parseFloat(data.balance);
      }
    } catch { /* fall back */ }
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
    twilio: {
      balance: twilioBalance ?? 20.07,
      label: 'Twilio Balance',
      live: twilioBalance !== null,
      phone: '(786) 998-5740',
    },
  });
}
