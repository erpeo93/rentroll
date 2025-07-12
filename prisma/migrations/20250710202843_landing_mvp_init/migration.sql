/*
  Warnings:

  - You are about to drop the `Holding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_productId_fkey";

-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_userId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "variants" TEXT[];

-- DropTable
DROP TABLE "Holding";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Intent" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "city" TEXT,
    "address" TEXT,
    "productId" TEXT NOT NULL,
    "variant" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Intent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "isUpcoming" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "step" INTEGER,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);
