import * as globalModels from '../../../global';
import * as localModels from '../../../local';

import { updateStatisticsFunctions } from '../exchanges';

class AllStatistics extends localModels.StatisticSet {
    public async init(): Promise<localModels.StatisticSet> {
        for (const exchange of globalModels.allExchanges) {
            const updateStatisticsFunction = updateStatisticsFunctions.get(exchange.nameCamelCase);
            exchange.updateStatisticsFunction = updateStatisticsFunction;
            await exchange.updateStatistics();
        }

        return this;
    }
}

export const allStatistics = new AllStatistics();