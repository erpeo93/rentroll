import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const since = new Date()
  since.setDate(since.getDate() - 30) // last 30 days

  // 1. Try to get most ordered product IDs in last 30 days
  const topProducts = await prisma.order.groupBy({
    by: ['productId'],
    where: { createdAt: { gte: since } },
    _count: true,
    orderBy: {
      _count: {
        productId: 'desc'
      }
    },
    take: 10
  })

  let ids = topProducts.map((p) => p.productId)

  // 2. If not enough hot products, fallback to random products
  if (ids.length < 10) {
    const randomProducts = await prisma.product.findMany({
      where: {
        id: { notIn: ids }
      },
      orderBy: {
        // PostgreSQL-specific random ordering
        // Use `orderBy: { RAND: 'asc' }` if using MySQL
        // This may need adjustment depending on the DB you use
        // Prisma does not have a built-in "random" ordering
      },
      take: 10 - ids.length,
      select: {
        id: true
      }
    })

    const randomIds = randomProducts.map((p) => p.id)
    ids = [...ids, ...randomIds]
  }

  // 3. Fetch full product data for all selected IDs
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
  })

  return NextResponse.json(products)
}