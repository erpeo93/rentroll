const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.productCategory.createMany({
    data: [
      { slug: "board-game", name: "Board Game" },
      { slug: "video-game", name: "Video Game" },
      { slug: "book", name: "Book" },
      { slug: "film", name: "Film" }
    ],
    skipDuplicates: true
  });

  console.log("✅ Seeded product categories");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});