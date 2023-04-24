import { allGames } from '../games/allGames';
import * as localModels from '../../../local';

class AllOutcomes extends localModels.OutcomeSet {
    public async init() {
        for (const game of allGames) {
            const spreadAway = await this.findOrCreate({
                game: game,
                name: 'spread_away',
            });

            await this.findOrCreate({
                game: game,
                name: 'spread_home',
                oppositeOutcome: spreadAway,
            });

            const moneylineAway = await this.findOrCreate({
                game: game,
                name: 'moneyline_away',
            });

            await this.findOrCreate({
                game: game,
                name: 'moneyline_home',
                oppositeOutcome: moneylineAway,
            });

            const totalOver = await this.findOrCreate({
                game: game,
                name: 'total_over',
            });

            await this.findOrCreate({
                game: game,
                name: 'total_under',
                oppositeOutcome: totalOver,
            });
        }
    }
}

export const allOutcomes = new AllOutcomes();