-- AlterTable
ALTER TABLE "Order" ADD COLUMN "paymentProvider" TEXT,
ADD COLUMN "checkoutSessionId" TEXT,
ADD COLUMN "paymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'created';

-- CreateIndex
CREATE UNIQUE INDEX "Order_checkoutSessionId_key" ON "Order"("checkoutSessionId");
