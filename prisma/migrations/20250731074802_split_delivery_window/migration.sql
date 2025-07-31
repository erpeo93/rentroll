/*
  Warnings:

  - You are about to drop the column `deliveryWindow` on the `Intent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Intent" DROP COLUMN "deliveryWindow",
ADD COLUMN     "deliveryWindowEnd" TIMESTAMP(3),
ADD COLUMN     "deliveryWindowStart" TIMESTAMP(3);
