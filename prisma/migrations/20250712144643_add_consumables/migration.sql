-- CreateTable
CREATE TABLE "Consumable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consumable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderConsumable" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "consumableId" TEXT NOT NULL,

    CONSTRAINT "OrderConsumable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderConsumable_orderId_consumableId_key" ON "OrderConsumable"("orderId", "consumableId");

-- AddForeignKey
ALTER TABLE "OrderConsumable" ADD CONSTRAINT "OrderConsumable_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderConsumable" ADD CONSTRAINT "OrderConsumable_consumableId_fkey" FOREIGN KEY ("consumableId") REFERENCES "Consumable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
