// src/app/api/categories/route.ts
import { PrismaClient, CategoryType  } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
const { searchParams } = new URL(req.url);
const typeParam = searchParams.get("type");
  const type = Object.values(CategoryType).includes(typeParam as CategoryType)
    ? (typeParam as CategoryType)
    : undefined;

  const where = type ? { type: type as CategoryType } : {};
  const categories = await prisma.productCategory.findMany({ where: where,
    select: { slug: true, name: true }
  });

  return NextResponse.json(categories);
}