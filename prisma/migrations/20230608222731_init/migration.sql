/*
  Warnings:

  - A unique constraint covering the columns `[leagueId,identifierFull]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_leagueId_identifierFull_key" ON "Team"("leagueId", "identifierFull");
