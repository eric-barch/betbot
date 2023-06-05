/*
  Warnings:

  - You are about to drop the `GamesOnExchanges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GamesOnExchanges" DROP CONSTRAINT "GamesOnExchanges_exchangeId_fkey";

-- DropForeignKey
ALTER TABLE "GamesOnExchanges" DROP CONSTRAINT "GamesOnExchanges_gameId_fkey";

-- DropTable
DROP TABLE "GamesOnExchanges";

-- CreateTable
CREATE TABLE "ExchangeToGame" (
    "exchangeId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "exchangeAssignedId" VARCHAR(255) NOT NULL,

    CONSTRAINT "ExchangeToGame_pkey" PRIMARY KEY ("exchangeId","gameId")
);

-- AddForeignKey
ALTER TABLE "ExchangeToGame" ADD CONSTRAINT "ExchangeToGame_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeToGame" ADD CONSTRAINT "ExchangeToGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
