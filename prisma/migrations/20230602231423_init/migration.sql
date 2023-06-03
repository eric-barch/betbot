/*
  Warnings:

  - Added the required column `exchangeId` to the `Odd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statisticId` to the `Odd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Odd" ADD COLUMN     "exchangeId" INTEGER NOT NULL,
ADD COLUMN     "statisticId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Odd" ADD CONSTRAINT "Odd_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Odd" ADD CONSTRAINT "Odd_statisticId_fkey" FOREIGN KEY ("statisticId") REFERENCES "Statistic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
