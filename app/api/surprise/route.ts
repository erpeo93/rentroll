import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { category, numPlayers, mood } = await req.json();

    const candidates = await prisma.product.findMany({
      where: {
        category: {
          slug: category,
          type: 'ENTERTAINMENT'
        },
        ...(numPlayers
          ? {
              minPlayers: {
                lte: parseInt(numPlayers)
              },
              maxPlayers: {
                gte: parseInt(numPlayers)
              }
            }
          : {}),
        ...(mood
          ? {
              moodTags: {
                has: mood
              }
            }
          : {})
      },
      include: {
        category: true
      },
      take: 20 // limit to keep it efficient
    });

    if (!candidates.length) {
      return NextResponse.json({ product: null, message: 'No match found' }, { status: 200 });
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selectedProduct = candidates[randomIndex];

    return NextResponse.json({ product: selectedProduct });
  } catch (error) {
    console.error('Surprise API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}