import { allExchanges } from '../exchanges/allExchanges';
import * as models from '../../../models';

class AllOdds extends models.OddSet {
    public async init() {
        for (const exchange of allExchanges) {
            await exchange.updateOdds();
        }
    }
}

export const allOdds = new AllOdds();