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
    "createdBy" VARCHAR(255) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Odd" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exchangeId" INTEGER NOT NULL,
    "statisticId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION,
    "price" INTEGER,
    "isVisible" BOOLEAN NOT NULL,

    CONSTRAINT "Odd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeToGame" (
    "exchangeId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "exchangeAssignedGameId" VARCHAR(255) NOT NULL,

    CONSTRAINT "ExchangeToGame_pkey" PRIMARY KEY ("exchangeId","gameId")
);

-- CreateTable
CREATE TABLE "_ExchangeToLeague" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_name_key" ON "Exchange"("name");

-- CreateIndex
CREATE UNIQUE INDEX "League_name_key" ON "League"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_leagueId_identifierFull_key" ON "Team"("leagueId", "identifierFull");

-- CreateIndex
CREATE UNIQUE INDEX "Statistic_name_gameId_key" ON "Statistic"("name", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "Odd_exchangeId_statisticId_key" ON "Odd"("exchangeId", "statisticId");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeToGame_exchangeId_exchangeAssignedGameId_key" ON "ExchangeToGame"("exchangeId", "exchangeAssignedGameId");

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
ALTER TABLE "Statistic" ADD CONSTRAINT "Statistic_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Odd" ADD CONSTRAINT "Odd_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Odd" ADD CONSTRAINT "Odd_statisticId_fkey" FOREIGN KEY ("statisticId") REFERENCES "Statistic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeToGame" ADD CONSTRAINT "ExchangeToGame_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeToGame" ADD CONSTRAINT "ExchangeToGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeToLeague" ADD CONSTRAINT "_ExchangeToLeague_A_fkey" FOREIGN KEY ("A") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExchangeToLeague" ADD CONSTRAINT "_ExchangeToLeague_B_fkey" FOREIGN KEY ("B") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;
