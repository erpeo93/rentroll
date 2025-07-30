import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { setVerificationCode } from '@/lib/cache/codeCache';

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  let { phone } = await req.json();

  if (!phone.startsWith('+39')) {
    phone = '+39' + phone.replace(/^0+/, ''); // remove leading 0s just in case
  }

const isTestEnv = process.env.NEXT_PUBLIC_TEST === 'true';

  let code = Math.floor(100000 + Math.random() * 900000).toString(); 
  setVerificationCode(phone, code);

  try {
    await client.messages.create({
      body: `Your RentRoll verification code is: ${code}`,
      from: process.env.TWILIO_PHONE!,
      to: phone,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
console.error('Twilio error:', err);
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}