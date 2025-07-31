import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

const awaited_params = await params
const categoryIdToDelete= awaited_params.id;

  try {
    const body = await req.json()
    const { migrateToCategoryId } = body

    if (!migrateToCategoryId || migrateToCategoryId === categoryIdToDelete) {
      return NextResponse.json(
        { error: 'You must specify a different category to migrate products to.' },
        { status: 400 }
      )
    }

    const category = await prisma.productCategory.findUnique({
      where: { id: categoryIdToDelete },
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    await prisma.product.updateMany({
      where: { categoryId: categoryIdToDelete },
      data: { categoryId: migrateToCategoryId },
    })

    await prisma.productCategory.delete({
      where: { id: categoryIdToDelete },
    })

    return NextResponse.json({ message: 'Category deleted and products migrated' })
  } catch (error: any) {
    console.error('[DELETE CATEGORY ERROR]', error)
    return NextResponse.json(
      { error: 'Something went wrong', detail: error.message },
      { status: 500 }
    )
  }
}