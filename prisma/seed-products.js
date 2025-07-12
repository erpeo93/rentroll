const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const boardGame = await prisma.productCategory.findUnique({ where: { slug: 'board-game' } });
  const videoGame = await prisma.productCategory.findUnique({ where: { slug: 'video-game' } });
  const book = await prisma.productCategory.findUnique({ where: { slug: 'book' } });
  const film = await prisma.productCategory.findUnique({ where: { slug: 'film' } });

  await prisma.product.createMany({
    data: [
      { name: 'Catan', value: 40, categoryId: boardGame.id },
      { name: 'Ticket to Ride', value: 35, categoryId: boardGame.id },
      { name: 'Dune', value: 20, categoryId: book.id },
      { name: 'Inception', value: 15, categoryId: film.id },
      { name: 'The Witcher 3', value: 60, categoryId: videoGame.id }
    ],
    skipDuplicates: true
  });

  console.log('✅ Seeded products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });