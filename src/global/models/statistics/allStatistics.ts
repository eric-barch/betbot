import * as globalModels from '../../../global';
import * as localModels from '../../../local';

import { updateGameStatisticsFunction } from './updateGameStatistics';

class AllStatistics extends localModels.StatisticSet {
    public async init(): Promise<localModels.StatisticSet> {
        for (const game of globalModels.allGames) {
            const updateStatisticsFunction = updateGameStatisticsFunction;
            game.updateStatisticsFunction = updateStatisticsFunction;
            await game.updateStatistics();
        }

        return this;
    }
}

export const allStatistics = new AllStatistics();