/*
  Warnings:

  - You are about to drop the column `productId` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the `Consumable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntentConsumable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntentConsumable" DROP CONSTRAINT "IntentConsumable_consumableId_fkey";

-- DropForeignKey
ALTER TABLE "IntentConsumable" DROP CONSTRAINT "IntentConsumable_intentId_fkey";

-- AlterTable
ALTER TABLE "Intent" DROP COLUMN "productId";

-- DropTable
DROP TABLE "Consumable";

-- DropTable
DROP TABLE "IntentConsumable";

-- CreateTable
CREATE TABLE "IntentProduct" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "IntentProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntentProduct" ADD CONSTRAINT "IntentProduct_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "Intent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentProduct" ADD CONSTRAINT "IntentProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
