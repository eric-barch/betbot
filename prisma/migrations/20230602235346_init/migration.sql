/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `Odd` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exchangeId,statisticId]` on the table `Odd` will be added. If there are existing duplicate values, this will fail.
  - Made the column `value` on table `Odd` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Odd" ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Odd_value_key" ON "Odd"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Odd_exchangeId_statisticId_key" ON "Odd"("exchangeId", "statisticId");
