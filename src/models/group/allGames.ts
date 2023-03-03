import * as models from '..';
import * as state from '../../state';

export class AllGames {
    private games: Array<models.Game>;

    constructor({
        games,
    }: {
        games?: Array<models.Game>,
    } = {}) {
        if (games) {
            this.games = games;
        } else {
            this.games = [];
        }
    }

    public getGame({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
    }) {
        let requestedGame = undefined;
        
        for (const game of this.games) {
            if (game.match({
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
            state.allGames.push({game: requestedGame});
        }

        return requestedGame;
    }

    public getAllGames() {
        return this.games;
    }

    public push({
        game,
    }: {
        game: models.Game,
    }) {
        this.games.push(game);
    }
}