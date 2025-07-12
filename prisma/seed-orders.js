const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ take: 5 });

  for (let i = 0; i < 20; i++) {
    const p = products[Math.floor(Math.random() * products.length)];

    await prisma.order.create({
      data: {
        productId: p.id,
        variant: "Standard",
        status: "requested",
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30) // last 30 days
      }
    });
  }

  console.log("✅ Seeded fake orders");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());