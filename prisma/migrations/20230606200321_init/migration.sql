/*
  Warnings:

  - Added the required column `active` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `Odd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `Statistic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Odd" ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Statistic" ADD COLUMN     "active" BOOLEAN NOT NULL;
