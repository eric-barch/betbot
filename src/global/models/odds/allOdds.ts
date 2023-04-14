import * as globalModels from '../../../global';
import * as localModels from '../../../local';

import { updateStatisticOddsFunctionsMap } from './updateFunctions/updateStatisticOdds';

class AllOdds extends localModels.OddSet {
    public async init(): Promise<localModels.OddSet> {
        for (const statistic of globalModels.allStatistics) {
            const updateOddsFunction = updateStatisticOddsFunctionsMap.get(statistic.name);
            statistic.updateOddsFunction = updateOddsFunction;
            await statistic.updateOdds();
        }

        return this;
    }
}

export const allOdds = new AllOdds();