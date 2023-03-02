import * as models from '..';
import * as state from '../../state';

export class AllGames {
    private games: Array<models.Game>;

    constructor({
        games,
        verbose = false,
    }: {
        games?: Array<models.Game>,
        verbose?: boolean,
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
        verbose = false,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
        verbose?: boolean,
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

    public getAllGames({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.games;
    }

    public push({
        game,
        verbose = false,
    }: {
        game: models.Game,
        verbose?: boolean,
    }) {
        this.games.push(game);
    }
}