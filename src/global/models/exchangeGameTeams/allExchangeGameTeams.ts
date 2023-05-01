import * as globalModels from '../../../global';
import * as localModels from '../../../models';

class AllExchangeGameTeams extends localModels.ExchangeGameTeamSet {
    public async init() {
        for (const exchangeGame of globalModels.allExchangeGames) {
            await exchangeGame.updateExchangeGameTeams();
        }
    }
}

export const allExchangeGameTeams = new AllExchangeGameTeams();