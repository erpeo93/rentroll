import { PrismaClient, CategoryType } from "@prisma/client";
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
const awaited_params = await params
const id = awaited_params.slug;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('[API /products/[slug]] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}