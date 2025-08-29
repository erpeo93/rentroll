import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const now = new Date()

  // Fetch all intents with deliveryWindowStart in the future, include user and products
  const intents = await prisma.intent.findMany({
    where: { deliveryWindowStart: { gt: now } },
    include: {
      user: true,
      products: { include: { product: true } }
    },
    orderBy: { deliveryWindowStart: 'asc' }
  })

  // Map to JSON serializable structure
  const data = intents.map((intent) => ({
    id: intent.id,
    city: intent.city,
    address: intent.address,
    deliveryWindowStart: intent.deliveryWindowStart,
    deliveryWindowEnd: intent.deliveryWindowEnd,
    email: intent.email,
    phone: intent.phone,
    deliveryFee: intent.deliveryFee,
    products: intent.products.map((ip) => ({
      productId: ip.productId,
      name: ip.product.name,
      quantity: ip.quantity ?? 1,
      price: ip.product.price
    }))
  }))

  return NextResponse.json(data)
}