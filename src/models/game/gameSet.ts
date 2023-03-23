import * as models from '..';

export class GameSet extends Set<models.Game> {

    add(game: models.Game): this {
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

        startDate = this.roundToNearest15Minute(startDate);
        
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

    private roundToNearest15Minute(date: Date) {
        const ROUND_TO_MINUTES = 15;
        
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_TO_MINUTES) * ROUND_TO_MINUTES;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);

        return roundedDate;
    }

}