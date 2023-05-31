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
CREATE TABLE "Exchangey" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Exchangey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaguey" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "abbreviation" VARCHAR(255) NOT NULL,

    CONSTRAINT "Leaguey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teamy" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "regionFull" VARCHAR(255) NOT NULL,
    "regionAbbr" VARCHAR(255) NOT NULL,
    "identifierFull" VARCHAR(255) NOT NULL,
    "identifierAbbr" VARCHAR(255) NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Teamy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gamey" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "awayTeamyId" INTEGER NOT NULL,
    "homeTeamyId" INTEGER NOT NULL,
    "leagueId" INTEGER NOT NULL,

    CONSTRAINT "Gamey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExchangeyToLeaguey" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExchangeyToLeaguey_AB_unique" ON "_ExchangeyToLeaguey"("A", "B");

-- CreateIndex
CREATE INDEX "_ExchangeyToLeaguey_B_index" ON "_ExchangeyToLeaguey"("B");

-- AddForeignKey
ALTER TABLE "Teamy" ADD CONSTRAINT "Teamy_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "Leaguey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gamey" ADD CONSTRAINT "Gamey_awayTeamyId_fkey" FOREIGN KEY ("awayTeamyId") REFERENCES "Teamy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gamey" ADD CONSTRAINT "Gamey_homeTeamyId_fkey" FOREIGN KEY ("homeTeamyId") REFERENCES "Teamy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gamey" ADD CONSTRAINT "Gamey_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "Leaguey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeyToLeaguey" ADD CONSTRAINT "_ExchangeyToLeaguey_A_fkey" FOREIGN KEY ("A") REFERENCES "Exchangey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeyToLeaguey" ADD CONSTRAINT "_ExchangeyToLeaguey_B_fkey" FOREIGN KEY ("B") REFERENCES "Leaguey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
