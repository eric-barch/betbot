import * as globalModels from '../../../global';
import * as localModels from '../../../local';

class AllExchangeGameTeams extends localModels.ExchangeGameTeamSet {
    public async init() {
        for (const exchangeGame of globalModels.allExchangeGames) {
            await exchangeGame.updateExchangeGameTeams();
        }
    }
}

export const allExchangeGameTeams = new AllExchangeGameTeams();