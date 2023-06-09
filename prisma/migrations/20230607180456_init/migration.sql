/*
  Warnings:

  - A unique constraint covering the columns `[gameId,name]` on the table `Statistic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Statistic_gameId_name_key" ON "Statistic"("gameId", "name");
