import { allExchangeGames } from '../exchangeGames/allExchangeGames';
import * as localModels from '../../../local';

class AllExchangeGameTeams extends localModels.ExchangeGameTeamSet {
    public async init() {
        for (const exchangeGame of allExchangeGames) {
            await exchangeGame.updateExchangeGameTeams();
        }
    }
}

export const allExchangeGameTeams = new AllExchangeGameTeams();