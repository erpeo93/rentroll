import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import sendAdminEmail from '@/lib/email/sendAdminEmail';
import { getVerificationCode, deleteVerificationCode } from '@/lib/cache/codeCache';
import { sendOrderEmail } from '@/lib/email/sendOrderEmail';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    phone,
    email,
    address,
    city,
    code,
    items,
    deliveryWindowStart,
    deliveryWindowEnd
  } = await req.json();
  
  let adj_phone = phone
  if (!phone.startsWith('+39')) {
    adj_phone = '+39' + phone.replace(/^0+/, ''); // remove leading 0s just in case
  }

  const isProdEnv = process.env.PRODUCTION === 'true';
  const correctCode = getVerificationCode(adj_phone);
  if (isProdEnv && code !== correctCode) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }
  deleteVerificationCode(adj_phone);

  const updatedItems = [];
  let hasChanges = false;

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.id } });
    if (!product || product.quantity === 0) {
      updatedItems.push({ ...item, quantity: 0, unavailable: true });
      hasChanges = true;
    } else if (item.quantity > product.quantity) {
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
    phone : adj_phone,
    email,
    status: 'verified',
    deliveryWindowStart: new Date(deliveryWindowStart),
    deliveryWindowEnd: new Date(deliveryWindowEnd),
    products: {
      create: items.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
  include: {
    products: {
      include: {
        product: true,
      },
    },
  },
});

/*
await sendOrderEmail({
  to: email,
  items: intent.products.map((p) => ({
    name: p.product.name,
    quantity: p.quantity,
    price: p.product.price,
  })),
  city,
  address,
  phone: adj_phone,
  deliveryStart: deliveryWindowStart,
  deliveryEnd: deliveryWindowEnd,
});
*/

    return intent;
  });

  //await sendAdminEmail('New Order', JSON.stringify(fulfilled, null, 2));
  return NextResponse.json({ success: true });
}