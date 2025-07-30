import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, CategoryType  } from "@prisma/client";


const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
const awaited_params = await params
const productId = awaited_params.id;
  const body = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        imageUrl: body.imageUrl,
        price: body.price,
        category: { connect: { id: body.categoryId } },
        secondaryImages : body.secondaryImages,
        bulletPoints: body.bulletPoints,
        moodTags: body.moodTags,
        minPlayers : body.minPlayers,
        maxPlayers: body.maxPlayers,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}