import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  const { email, phone, name, city, address, productId, variant } = data;

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  // Step 1: Find or create user
  let user = null;

  if (email || phone) {
    user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email || undefined }, { phone: phone || undefined }]
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          phone
        }
      });
    }
  }

  // Step 2: Generate confirmation token (optional for now)
  const confirmationToken = randomUUID();

  // Step 3: Create intent
  const intent = await prisma.intent.create({
    data: {
      userId: user?.id,
      city,
      address,
      productId,
      variant,
      status: "submitted",
      confirmationToken
    }
  });

  return NextResponse.json({ success: true, intentId: intent.id });
}