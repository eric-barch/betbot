/*
  Warnings:

  - You are about to drop the `LeaguesOnExchanges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LeaguesOnExchanges" DROP CONSTRAINT "LeaguesOnExchanges_exchangeId_fkey";

-- DropForeignKey
ALTER TABLE "LeaguesOnExchanges" DROP CONSTRAINT "LeaguesOnExchanges_leagueId_fkey";

-- DropTable
DROP TABLE "LeaguesOnExchanges";

-- CreateTable
CREATE TABLE "_ExchangeToLeague" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExchangeToLeague_AB_unique" ON "_ExchangeToLeague"("A", "B");

-- CreateIndex
CREATE INDEX "_ExchangeToLeague_B_index" ON "_ExchangeToLeague"("B");

-- AddForeignKey
ALTER TABLE "_ExchangeToLeague" ADD CONSTRAINT "_ExchangeToLeague_A_fkey" FOREIGN KEY ("A") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeToLeague" ADD CONSTRAINT "_ExchangeToLeague_B_fkey" FOREIGN KEY ("B") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
