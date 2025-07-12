import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const consumables = await prisma.consumable.findMany();
  return NextResponse.json(consumables);
}