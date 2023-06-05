/*
  Warnings:

  - You are about to drop the column `exchangeAssignedId` on the `ExchangeToGame` table. All the data in the column will be lost.
  - Added the required column `exchangeAssignedGameId` to the `ExchangeToGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExchangeToGame" DROP COLUMN "exchangeAssignedId",
ADD COLUMN     "exchangeAssignedGameId" VARCHAR(255) NOT NULL;
