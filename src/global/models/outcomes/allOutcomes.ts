import { allGames } from '../games/allGames';
import * as localModels from '../../../local';

class AllOutcomes extends localModels.OutcomeSet {
    public async init() {
        for (const game of allGames) {
            await this.findOrCreate({
                game: game,
                name: 'spread_away',
            });

            await this.findOrCreate({
                game: game,
                name: 'spread_home',
            });

            await this.findOrCreate({
                game: game,
                name: 'moneyline_away',
            });

            await this.findOrCreate({
                game: game,
                name: 'moneyline_home',
            });

            await this.findOrCreate({
                game: game,
                name: 'total_over',
            });

            await this.findOrCreate({
                game: game,
                name: 'total_under',
            });
        }
    }
}

export const allOutcomes = new AllOutcomes();