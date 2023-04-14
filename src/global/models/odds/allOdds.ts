import * as globalModels from '../../../global';
import * as localModels from '../../../local';

class AllOdds extends localModels.OddSet {
    public async init(): Promise<localModels.OddSet> {
        for (const exchange of globalModels.allExchanges) {
            await exchange.updateOdds();
        }

        return this;
    }
}

export const allOdds = new AllOdds();