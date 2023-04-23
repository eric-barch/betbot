import * as localModels from '../../../local';

class AllExchanges extends localModels.ExchangeSet {
    public async init() {
        /**TODO: Make these singletons and export named instances so they can be accessed throughout
         * the program. */
        this.add(new localModels.DraftKingsExchange);
        this.add(new localModels.FanDuelExchange);
        this.add(new localModels.SugarHouseExchange);

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
