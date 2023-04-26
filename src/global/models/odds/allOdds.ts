import { allExchanges } from '../exchanges/allExchanges';
import * as localModels from '../../../models';

class AllOdds extends localModels.OddSet {
    public async init() {
        for (const exchange of allExchanges) {
            await exchange.updateOdds();
        }
    }
}

export const allOdds = new AllOdds();