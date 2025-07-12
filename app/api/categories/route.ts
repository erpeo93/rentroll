// src/app/api/categories/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const categories = await prisma.productCategory.findMany({
    select: { slug: true, name: true }
  });

  return NextResponse.json(categories);
}