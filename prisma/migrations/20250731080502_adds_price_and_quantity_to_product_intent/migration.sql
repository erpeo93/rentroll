-- AlterTable
ALTER TABLE "IntentProduct" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 10,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
