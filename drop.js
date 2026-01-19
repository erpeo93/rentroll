import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "Intent" ADD COLUMN "deliveryFee" DOUBLE PRECISION;`);
  console.log("Column dropped!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());