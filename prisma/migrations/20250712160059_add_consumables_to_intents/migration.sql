/*
  Warnings:

  - You are about to drop the `OrderConsumable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderConsumable" DROP CONSTRAINT "OrderConsumable_consumableId_fkey";

-- DropForeignKey
ALTER TABLE "OrderConsumable" DROP CONSTRAINT "OrderConsumable_orderId_fkey";

-- DropTable
DROP TABLE "OrderConsumable";

-- CreateTable
CREATE TABLE "IntentConsumable" (
    "id" TEXT NOT NULL,
    "intentId" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,

    CONSTRAINT "IntentConsumable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntentConsumable" ADD CONSTRAINT "IntentConsumable_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "Intent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentConsumable" ADD CONSTRAINT "IntentConsumable_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "Consumable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
