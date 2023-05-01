import * as global from '../../../global';
import * as models from '../../../models';

class AllExchangeGameTeams extends models.ExchangeGameTeamSet {
    public async init() {
        for (const exchangeGame of global.allExchangeGames) {
            await exchangeGame.updateExchangeGameTeams();
        }
    }
}

export const allExchangeGameTeams = new AllExchangeGameTeams();