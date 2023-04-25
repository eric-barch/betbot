import { allGames } from '../games/allGames';
import * as localModels from '../../../local';

class AllOutcomes extends localModels.OutcomeSet {
    public async init() {
        for (const game of allGames) {
            const spreadAway = await this.findOrCreate({
                game: game,
                name: 'spread_away',
                team: game.awayTeam,
            });

            await this.findOrCreate({
                game: game,
                name: 'spread_home',
                team: game.homeTeam,
                oppositeOutcome: spreadAway,
            });

            const moneylineAway = await this.findOrCreate({
                game: game,
                name: 'moneyline_away',
                team: game.awayTeam,
            });

            await this.findOrCreate({
                game: game,
                name: 'moneyline_home',
                team: game.homeTeam,
                oppositeOutcome: moneylineAway,
            });

            const totalOver = await this.findOrCreate({
                game: game,
                name: 'total_over',
                team: game.awayTeam,
            });

            await this.findOrCreate({
                game: game,
                name: 'total_under',
                team: game.homeTeam,
                oppositeOutcome: totalOver,
            });
        }
    }

    public async checkForArbs() {
        for (const outcome of this) {
            await outcome.checkForArbs();
        }
    }
}

export const allOutcomes = new AllOutcomes();