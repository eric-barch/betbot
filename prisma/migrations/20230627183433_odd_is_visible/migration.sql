/*
  Warnings:

  - Added the required column `isVisible` to the `Odd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Odd" ADD COLUMN     "isVisible" BOOLEAN NOT NULL;
