import { allExchanges } from '../exchanges';
import * as localModels from '../../../local';

class AllGames extends localModels.GameSet {
    public async init() {
        for (const exchange of allExchanges) {
            await exchange.getGames();
        }
    }
}

export const allGames = new AllGames();