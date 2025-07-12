/*
  Warnings:

  - You are about to drop the column `email` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Intent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Intent" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Intent" ADD CONSTRAINT "Intent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
