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
    variant,
    productIds,
    consumables,
  } = data;

  // Validate required fields
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ error: "Missing productIds" }, { status: 400 });
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

  // Step 2: Create intent (order)
  const confirmationToken = randomUUID();

  const allProductIds = [
    ...productIds,
    ...((consumables as string[] | undefined) ?? []),
  ];

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