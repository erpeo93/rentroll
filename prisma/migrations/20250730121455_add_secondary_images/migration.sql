-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "secondaryImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
