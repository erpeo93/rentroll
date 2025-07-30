import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import sendAdminEmail from '@/lib/email/sendAdminEmail';
import { getVerificationCode, deleteVerificationCode } from '@/lib/cache/codeCache';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { phone, email, address, city, code, items } = await req.json();

const isProdEnv = process.env.PRODUCTION === 'true';
const correctCode = getVerificationCode(phone);
if (isProdEnv && code !== correctCode) {
  return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
}
deleteVerificationCode(phone);

const updatedItems = [];
let hasChanges = false;

for (const item of items) {
  const product = await prisma.product.findUnique({ where: { id: item.id } });
  if (!product || product.quantity === 0) {
    // Product no longer available, remove from cart
    updatedItems.push({ ...item, quantity: 0, unavailable: true });
    hasChanges = true;
  } else if (item.quantity > product.quantity) {
    // Requested quantity is too high, adjust
    updatedItems.push({ ...item, quantity: product.quantity, adjusted: true });
    hasChanges = true;
  } else {
    updatedItems.push(item);
  }
}

if (hasChanges) {
  return NextResponse.json(
    { items: updatedItems, message: 'Some items were updated due to stock changes.' },
    { status: 409 }
  );
}

const fulfilled = await prisma.$transaction(async (tx) => {

  for (const item of items) {
    const product = await tx.product.findUnique({ where: { id: item.id } });

    if (!product || product.quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${item.id}`);
    }

    await tx.product.update({
      where: { id: item.id },
      data: {
        quantity: {
          decrement: item.quantity,
        },
      },
    });
  }

  const intent = await tx.intent.create({
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

return intent;
});

  await sendAdminEmail('New Order', JSON.stringify(fulfilled, null, 2));
  return NextResponse.json({ success: true });
}