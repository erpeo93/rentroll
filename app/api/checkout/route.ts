import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  const {
    email,
    phone,
    name,
    city,
    address,
    productId,
    variant,
    consumables
  } = data;

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  // Step 1: Find or create user
  let user = null;

  if (email || phone) {
    user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          phone,
        },
      });
    }
  }

  // Step 2: Generate confirmation token
  const confirmationToken = randomUUID();

const allProductIds = [
  productId,                      // the main product
  ...((consumables as { id: string }[] | undefined) ?? []).map((c) => c.id),
];

await prisma.intentProduct.createMany({
  data: allProductIds.map(pid => ({
    intentId: intent.id,
    productId: pid
  }))
});

  // Step 3: Create intent (order)
  const intent = await prisma.intent.create({
    data: {
      userId: user?.id,
      city,
      address,
      variant,
      status: "submitted",
      confirmationToken,
      products: {
        create: allProductIds.map((id: string) => ({
          product: {
            connect: { id },
          },
        })),
      },
    },
  });

  return NextResponse.json({ success: true, intentId: intent.id });
}