import * as globalModels from '../../../global';
import * as localModels from '../../../models';

class AllExchangeGames extends localModels.ExchangeGameSet {
    public async init() {
        for (const exchange of globalModels.allExchanges) {
            await exchange.updateExchangeGames();
        }
    }
}

export const allExchangeGames = new AllExchangeGames();