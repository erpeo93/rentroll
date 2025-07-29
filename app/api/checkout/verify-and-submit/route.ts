import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import sendAdminEmail from '@/lib/email/sendAdminEmail';
import { getVerificationCode, deleteVerificationCode } from '@/lib/cache/codeCache';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { phone, email, address, city, code, items } = await req.json();

const correctCode = getVerificationCode(phone);
if (0 && code !== correctCode) {
  return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
}
deleteVerificationCode(phone);

  const intent = await prisma.intent.create({
    data: {
      city,
      address,
      status: 'verified',
      products: {
        create: items.map((item: any) => ({
          productId: item.id,
        })),
      },
    },
  });

  await sendAdminEmail('New Order', JSON.stringify(intent, null, 2));
  return NextResponse.json({ success: true });
}