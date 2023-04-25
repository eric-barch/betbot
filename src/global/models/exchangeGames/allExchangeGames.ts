import { allExchanges } from '../exchanges/allExchanges';
import * as localModels from '../../../local';

class AllExchangeGames extends localModels.ExchangeGameSet {
    public async init() {
        for (const exchange of allExchanges) {
            await exchange.updateExchangeGames();
        }
    }
}

export const allExchangeGames = new AllExchangeGames();