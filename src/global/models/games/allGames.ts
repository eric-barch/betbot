import { allExchanges } from '../exchanges';
import * as models from '../../../models';

class AllGames extends models.GameSet {
    public async init() {
        for (const exchange of allExchanges) {
            await exchange.getGames();
        }
    }
}

export const allGames = new AllGames();