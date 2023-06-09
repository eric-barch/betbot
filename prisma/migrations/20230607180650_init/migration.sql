/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Statistic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Statistic_id_key" ON "Statistic"("id");
