-- CreateTable
CREATE TABLE "CurrentRate" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" SERIAL NOT NULL,
    "base" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CurrentRate_currency_key" ON "CurrentRate"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_base_target_date_key" ON "ExchangeRate"("base", "target", "date");
