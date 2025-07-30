import { NextResponse } from 'next/server';
import { PrismaClient, CategoryType  } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, quantity, description, imageUrl, price, categoryId, secondaryImages, bulletPoints, moodTags, minPlayers, maxPlayers } = body;

    if (!name || price == null || quantity == null || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const value = price;

    const newProduct = await prisma.product.create({
      data: {
        name,
        quantity,
        description,
        imageUrl,
        price,
        value,
        category: { connect: { id: categoryId } },
        secondaryImages,
        bulletPoints,
        moodTags,
        minPlayers,
        maxPlayers,
      },
    });

    return NextResponse.json(newProduct);
  } catch (err: any) {
    console.error('[POST] /api/admin/products error:', err);
    return NextResponse.json(
      { error: 'Failed to create product', detail: err.message },
      { status: 500 }
    );
  }
}