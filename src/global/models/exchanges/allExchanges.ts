import * as localModels from '../../../models';

export const draftKingsExchange = new localModels.DraftKingsExchange();
export const fanDuelExchange = new localModels.FanDuelExchange();
export const sugarHouseExchange = new localModels.SugarHouseExchange();

class AllExchanges extends localModels.ExchangeSet {
    public async init() {
        /**TODO: Make these singletons. */
        this.add(draftKingsExchange);
        // this.add(fanDuelExchange);
        // this.add(sugarHouseExchange);

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
