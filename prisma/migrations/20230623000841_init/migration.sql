/*
  Warnings:

  - A unique constraint covering the columns `[exchangeId,exchangeAssignedGameId]` on the table `ExchangeToGame` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[exchangeId,statisticId]` on the table `Odd` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,gameId]` on the table `Statistic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leagueId,identifierFull]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExchangeToGame_exchangeId_exchangeAssignedGameId_key" ON "ExchangeToGame"("exchangeId", "exchangeAssignedGameId");

-- CreateIndex
CREATE UNIQUE INDEX "Odd_exchangeId_statisticId_key" ON "Odd"("exchangeId", "statisticId");

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_name_gameId_key" ON "Statistic"("name", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_leagueId_identifierFull_key" ON "Team"("leagueId", "identifierFull");
