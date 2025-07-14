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

  await prisma.product.createMany({
    data: [
      {
        name: 'Just One',
        categoryId: boardGame.id,
        minPlayers: 3,
        maxPlayers: 7,
        moodTags: ['cooperative', 'lighthearted']
      },
      {
        name: 'The Mind',
        categoryId: boardGame.id,
        minPlayers: 2,
        maxPlayers: 4,
        moodTags: ['cooperative', 'intense']
      },
      {
        name: 'Monikers',
        categoryId: boardGame.id,
        minPlayers: 4,
        maxPlayers: 10,
        moodTags: ['party', 'funny']
      },
      {
        name: 'Azul',
        categoryId: boardGame.id,
        minPlayers: 2,
        maxPlayers: 4,
        moodTags: ['strategic', 'chill']
      }
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