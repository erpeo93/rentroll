const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
await prisma.$transaction([
  prisma.IntentProduct.deleteMany(),
  prisma.Order.deleteMany(),
  prisma.Product.deleteMany(),
  prisma.ProductCategory.deleteMany(),
  prisma.ImprovementSubmission.deleteMany(),
  prisma.Intent.deleteMany(),
]);
  console.log('✅ Database cleared.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());