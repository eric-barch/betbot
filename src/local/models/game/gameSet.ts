import * as localModels from '../../../local/models';

export class GameSet extends Set<localModels.Game> {
    public async getGameByTeamsAndStartDate({
        awayTeam,
        homeTeam,
        exchange,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        exchange?: localModels.Exchange,
        startDate: Date,
    }): Promise<localModels.Game> {
        let requestedGame = undefined;
        
        for (const game of this) {
            if (game.matchesByTeamsAndStartDate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                requestedGame = game;

                if (exchange) {
                    requestedGame.exchangeSet.add(exchange);
                    exchange.gameSet.add(requestedGame);
                }

                break;
            }
        }

        if (requestedGame === undefined) {
            requestedGame = await localModels.Game.create({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                exchange: exchange,
                startDate: startDate,
            });
            
            this.add(requestedGame);
        }

        return requestedGame;
    }
}