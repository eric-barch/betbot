import * as models from '../../../models';

/**TODO: make these singletons. */
export const draftKingsExchange = new models.DraftKingsExchange();
export const fanDuelExchange = new models.FanDuelExchange();
export const sugarHouseExchange = new models.SugarHouseExchange();

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
