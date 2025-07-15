import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  await prisma.improvementSubmission.create({
    data: {
      answers: body.answers, // Prisma JSON field
    },
  });

  return NextResponse.json({ success: true });
}