import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest } from 'next';

const prisma = new PrismaClient();
export const runtime = 'nodejs';

interface DeleteContext {
  params: {
    id: string;
  };
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
const awaited_params = await params
const id = awaited_params.id;

    const deleted = await prisma.product.delete({ where: { id } });
    console.log('[DELETE] Deleted product:', deleted);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', detail: error.message },
      { status: 500 }
    );
  }
}