/*
  Warnings:

  - You are about to drop the `Exchange` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExchangeToGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `League` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Odd` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Statistic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExchangeToLeague` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExchangeToGame" DROP CONSTRAINT "ExchangeToGame_exchangeId_fkey";

-- DropForeignKey
ALTER TABLE "ExchangeToGame" DROP CONSTRAINT "ExchangeToGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_homeTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Odd" DROP CONSTRAINT "Odd_exchangeId_fkey";

-- DropForeignKey
ALTER TABLE "Odd" DROP CONSTRAINT "Odd_statisticId_fkey";

-- DropForeignKey
ALTER TABLE "Statistic" DROP CONSTRAINT "Statistic_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_leagueId_fkey";

-- DropForeignKey
ALTER TABLE "_ExchangeToLeague" DROP CONSTRAINT "_ExchangeToLeague_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExchangeToLeague" DROP CONSTRAINT "_ExchangeToLeague_B_fkey";

-- DropTable
DROP TABLE "Exchange";

-- DropTable
DROP TABLE "ExchangeToGame";

-- DropTable
DROP TABLE "Game";

-- DropTable
DROP TABLE "League";

-- DropTable
DROP TABLE "Odd";

-- DropTable
DROP TABLE "Statistic";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "_ExchangeToLeague";
