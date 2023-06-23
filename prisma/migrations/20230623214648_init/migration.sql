/*
  Warnings:

  - A unique constraint covering the columns `[name,gameId]` on the table `Statistic` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Statistic_name_gameId_key" ON "Statistic"("name", "gameId");
