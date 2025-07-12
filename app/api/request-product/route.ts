import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, language, isUpcoming, email } = body;

    if (!name || !category || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.productRequest.create({
      data: {
        name,
        category,
        language,
        isUpcoming,
        email
      }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Request product error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}