import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const since = new Date();
  since.setDate(since.getDate() - 30); // ✅ last 30 days (can adjust)

const topProducts = await prisma.order.groupBy({
  by: ['productId'],
  where: {
    createdAt: { gte: since }
  },
  _count: true,
  orderBy: {
    _count: {
      productId: 'desc'
    }
  },
  take: 10
});

  const ids = topProducts.map((p) => p.productId);

const products = await prisma.product.findMany({
  where: { id: { in: ids } },
  select: {
    id: true,
    name: true,
    description: true,
    imageUrl: true,
    bulletPoints: true,
    minPlayers: true,
    maxPlayers: true,
    moodTags: true,
    category: true
  }
});

  return NextResponse.json(products);
}