import * as global from '../../global';
import * as models from '../../models';

export class GameSet extends Set<models.Game> {
    add(game: models.Game): this {
        if (global.allGames !== undefined) {
            if (this === global.allGames) {
                // Some code to add to or update MySQL.
            } else {
                global.allGames.add(game);
            }
        }

        return super.add(game);
    }

    public async getGameByTeamsAndStartDate({
        awayTeam,
        homeTeam,
        startDate,
        exchange,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
        exchange?: models.Exchange,
    }) {
        let requestedGame = undefined;
        
        for (const game of this) {
            if (game.matchesByTeamsAndStartDate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            })) {
                requestedGame = game;
                break;
            }
        }

        if (requestedGame === undefined) {
            requestedGame = new models.Game({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
            
            await requestedGame.initialize();
            this.add(requestedGame);
        }

        if (exchange) {
            requestedGame.getExchangesGroup().add(exchange);
            exchange.getGamesGroup().add(requestedGame);
        }

        return requestedGame;
    }
}