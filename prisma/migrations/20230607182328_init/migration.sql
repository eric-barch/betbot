/*
  Warnings:

  - A unique constraint covering the columns `[exchangeId,exchangeAssignedGameId]` on the table `ExchangeToGame` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExchangeToGame_exchangeId_exchangeAssignedGameId_key" ON "ExchangeToGame"("exchangeId", "exchangeAssignedGameId");
