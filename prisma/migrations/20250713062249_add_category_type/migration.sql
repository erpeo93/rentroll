-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ENTERTAINMENT', 'CONSUMABLE');

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "type" "CategoryType" NOT NULL DEFAULT 'ENTERTAINMENT';
