/*
  Warnings:

  - You are about to drop the `CurrentRate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExchangeRate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CurrentRate";

-- DropTable
DROP TABLE "ExchangeRate";

-- CreateTable
CREATE TABLE "currentRate" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currentRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchangeRate" (
    "id" SERIAL NOT NULL,
    "base" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currentRate_currency_key" ON "currentRate"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "exchangeRate_base_target_date_key" ON "exchangeRate"("base", "target", "date");
