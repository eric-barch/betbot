import { DraftKingsExchange } from "../../../models/primary/exchange/exchange/exchangeModels/draftKings";
import { FanDuelExchange } from "../../../models/primary/exchange/exchange/exchangeModels/fanDuel";
import { SugarHouseExchange } from "../../../models/primary/exchange/exchange/exchangeModels/sugarHouse";

import * as models from '../../../models';

/**TODO: make these singletons. */
export const draftKingsExchange = new DraftKingsExchange();
export const fanDuelExchange = new FanDuelExchange();
export const sugarHouseExchange = new SugarHouseExchange();

class AllExchanges extends models.ExchangeSet {
    public async init() {
        this.add(draftKingsExchange);
        this.add(fanDuelExchange);
        this.add(sugarHouseExchange);
        
        for (const exchange of this) {
            await exchange.init();
        }
    }

    public async updateExchangeGames() {
        for (const exchange of this) {
            await exchange.updateExchangeGames();
        }
    }
}

export const allExchanges = new AllExchanges();
