/*
  Warnings:

  - You are about to drop the `Exchange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `League` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExchangeToLeague` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "_ExchangeToLeague" DROP CONSTRAINT "_ExchangeToLeague_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExchangeToLeague" DROP CONSTRAINT "_ExchangeToLeague_B_fkey";

-- DropTable
DROP TABLE "Exchange";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "League";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_ExchangeToLeague";

-- CreateTable
CREATE TABLE "exchange" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "league" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "abbreviation" VARCHAR(255) NOT NULL,

    CONSTRAINT "league_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionFull" VARCHAR(255) NOT NULL,
    "regionAbbr" VARCHAR(255) NOT NULL,
    "identifierFull" VARCHAR(255) NOT NULL,
    "identifierAbbr" VARCHAR(255) NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_exchangeToleague" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_exchangeToleague_AB_unique" ON "_exchangeToleague"("A", "B");

-- CreateIndex
CREATE INDEX "_exchangeToleague_B_index" ON "_exchangeToleague"("B");

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "team_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_exchangeToleague" ADD CONSTRAINT "_exchangeToleague_A_fkey" FOREIGN KEY ("A") REFERENCES "exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_exchangeToleague" ADD CONSTRAINT "_exchangeToleague_B_fkey" FOREIGN KEY ("B") REFERENCES "league"("id") ON DELETE CASCADE ON UPDATE CASCADE;
