import * as models from '..';
import * as state from '../../state';

export class GamesGroup {
    private gamesArray: Array<models.Game>;

    constructor({
        games,
    }: {
        games?: Array<models.Game>,
    } = {}) {
        if (games) {
            this.gamesArray = games;
        } else {
            this.gamesArray = [];
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
        
        for (const game of this.gamesArray) {
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
            this.gamesArray.push(requestedGame);
        }

        return requestedGame;
    }

    public getAllGames() {
        return this.gamesArray;
    }

    public getLength() {
        return this.gamesArray.length;
    }

    // public push({
    //     game,
    // }: {
    //     game: models.Game,
    // }) {
    //     this.games.push(game);
    // }
}