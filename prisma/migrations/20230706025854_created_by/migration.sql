/*
  Warnings:

  - You are about to drop the column `creationExchange` on the `Game` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "creationExchange",
ADD COLUMN     "createdBy" VARCHAR(255) NOT NULL;
