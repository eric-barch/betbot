-- CreateTable
CREATE TABLE "GamesOnExchanges" (
    "exchangeId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "exchangeAssignedId" VARCHAR(255) NOT NULL,

    CONSTRAINT "GamesOnExchanges_pkey" PRIMARY KEY ("exchangeId","gameId")
);

-- AddForeignKey
ALTER TABLE "GamesOnExchanges" ADD CONSTRAINT "GamesOnExchanges_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamesOnExchanges" ADD CONSTRAINT "GamesOnExchanges_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
