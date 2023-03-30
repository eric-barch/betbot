import * as models from '../../models';

export class GameSet extends Set<models.Game> {
    add(game: models.Game): this {
        if (this !== models.allGames) {
            models.allGames.add(game);
        }

        return super.add(game);
    }

    public getGameByTeamsAndStartDate({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
    }) {
        let requestedGame = undefined;

        startDate = models.Game.roundToNearestInterval(startDate);
        
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

            this.add(requestedGame);
        }

        return requestedGame;
    }
}