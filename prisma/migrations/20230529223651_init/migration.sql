/*
  Warnings:

  - You are about to drop the `GamesOnPages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GamesOnPages" DROP CONSTRAINT "GamesOnPages_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamesOnPages" DROP CONSTRAINT "GamesOnPages_pageId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_leagueOnExchangeId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_pageTypeId_fkey";

-- DropTable
DROP TABLE "GamesOnPages";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "PageType";
