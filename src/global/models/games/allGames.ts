import * as globalModels from '../../../global';
import * as localModels from '../../../local';

import { updateExchangeGamesFunctionsMap } from './updateExchangeGames';

class AllGames extends localModels.GameSet {
    public async init(): Promise<localModels.GameSet> {
        for (const exchange of globalModels.allExchanges) {
            const updateGamesFunction = updateExchangeGamesFunctionsMap.get(exchange.nameCamelCase);
            exchange.updateGamesFunction = updateGamesFunction;
            await exchange.updateGames();
        }

        return this;
    }
}

export const allGames = new AllGames();