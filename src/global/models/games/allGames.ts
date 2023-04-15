import * as globalModels from '../../../global';
import * as localModels from '../../../local';

import { updateGamesFunctions } from '../exchanges';

class AllGames extends localModels.GameSet {
    public async init(): Promise<localModels.GameSet> {
        for (const exchange of globalModels.allExchanges) {
            await exchange.updateGames();
        }
        
        return this;
    }
}

export const allGames = new AllGames();