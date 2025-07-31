import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, type } = body

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing name or type' }, { status: 400 })
    }

    const slug = slugify(name, { lower: true })

    const existing = await prisma.productCategory.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
    }

    const category = await prisma.productCategory.create({
      data: {
        name,
        slug,
        type,
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('[CREATE CATEGORY ERROR]', error)
    return NextResponse.json(
      { error: 'Something went wrong', detail: error.message },
      { status: 500 }
    )
  }
}