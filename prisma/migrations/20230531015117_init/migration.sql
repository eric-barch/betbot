/*
  Warnings:

  - You are about to drop the `_exchangeToleague` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `exchange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `league` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_exchangeToleague" DROP CONSTRAINT "_exchangeToleague_A_fkey";

-- DropForeignKey
ALTER TABLE "_exchangeToleague" DROP CONSTRAINT "_exchangeToleague_B_fkey";

-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "game" DROP CONSTRAINT "game_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "team" DROP CONSTRAINT "team_leagueId_fkey";

-- DropTable
DROP TABLE "_exchangeToleague";

-- DropTable
DROP TABLE "exchange";

-- DropTable
DROP TABLE "game";

-- DropTable
DROP TABLE "league";

-- DropTable
DROP TABLE "team";

-- CreateTable
CREATE TABLE "Exchange" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "abbreviation" VARCHAR(255) NOT NULL,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionFull" VARCHAR(255) NOT NULL,
    "regionAbbr" VARCHAR(255) NOT NULL,
    "identifierFull" VARCHAR(255) NOT NULL,
    "identifierAbbr" VARCHAR(255) NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

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
ALTER TABLE "Team" ADD CONSTRAINT "Team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeToLeague" ADD CONSTRAINT "_ExchangeToLeague_A_fkey" FOREIGN KEY ("A") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeToLeague" ADD CONSTRAINT "_ExchangeToLeague_B_fkey" FOREIGN KEY ("B") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
