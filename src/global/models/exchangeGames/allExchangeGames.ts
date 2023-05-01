import * as global from '../../../global';
import * as models from '../../../models';

class AllExchangeGames extends models.ExchangeGameSet {
    public async init() {
        for (const exchange of global.allExchanges) {
            await exchange.updateExchangeGames();
        }
    }
}

export const allExchangeGames = new AllExchangeGames();