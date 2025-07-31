import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  const randomProducts = await prisma.$queryRaw`
    SELECT *
    FROM "Product"
    ORDER BY RANDOM()
    LIMIT 100
  `

  return NextResponse.json(randomProducts)
}