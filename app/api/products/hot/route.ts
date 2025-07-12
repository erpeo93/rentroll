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
    include: { category: true }
  });

  return NextResponse.json(products);
}