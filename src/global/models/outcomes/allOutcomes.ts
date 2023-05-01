import { allGames } from '../games/allGames';
import { OutcomeType } from '../../../models';
import * as models from '../../../models';


class AllOutcomes extends models.OutcomeSet {
    public async init() {
        for (const game of allGames) {
            const spreadAway = await this.findOrCreate({
                game: game,
                type: OutcomeType.SpreadAway,
            });

            await this.findOrCreate({
                game: game,
                type: OutcomeType.SpreadHome,
                oppositeOutcome: spreadAway,
            });

            const moneylineAway = await this.findOrCreate({
                game: game,
                type: OutcomeType.MoneylineAway,
            });

            await this.findOrCreate({
                game: game,
                type: OutcomeType.MoneylineHome,
                oppositeOutcome: moneylineAway,
            });

            const totalOver = await this.findOrCreate({
                game: game,
                type: OutcomeType.TotalOver,
            });

            await this.findOrCreate({
                game: game,
                type: OutcomeType.TotalUnder,
                oppositeOutcome: totalOver,
            });
        }
    }
}

export const allOutcomes = new AllOutcomes();