-- CreateTable
CREATE TABLE "userSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDark" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'ko',
    "cardCount" INTEGER NOT NULL DEFAULT 4,
    "selectedCurrencies" JSONB NOT NULL DEFAULT '["KRW","USD","VND","JPY"]',

    CONSTRAINT "userSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userSettings_userId_key" ON "userSettings"("userId");

-- AddForeignKey
ALTER TABLE "userSettings" ADD CONSTRAINT "userSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
