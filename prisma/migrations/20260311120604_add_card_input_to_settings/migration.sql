-- AlterTable
ALTER TABLE "userSettings" ADD COLUMN     "focusCard" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "inputAmount" TEXT NOT NULL DEFAULT '0';
