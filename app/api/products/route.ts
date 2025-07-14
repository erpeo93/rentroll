import { PrismaClient, CategoryType } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive"
      },
      category: {
        ...(category ? { slug: category } : {}),
        ...(type ? { type: type as CategoryType } : {})
      }
    },
    include: {
      category: true
    },
    take: 50
  });

  return NextResponse.json(products);
}