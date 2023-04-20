import * as localModels from '../../../local';
import * as updateFunctions from '../../../update';

class AllExchanges extends localModels.ExchangeSet {
    public async init(): Promise<localModels.ExchangeSet> {
        const draftKings = await localModels.Exchange.create({
            name: 'DraftKings',
            url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
            updateExchangeGamesFunction: updateFunctions.exchangeGames.draftKings,
            updateExchangeGameElementFunction: updateFunctions.exchangeGameElement.draftKings,
            updateExchangeGameTeamElementFunction: updateFunctions.exchangeGameTeamElement.draftKings,
            updateExchangeOutcomesFunction: updateFunctions.exchangeOutcomes.draftKings,
            updateOddElementsFunctions: updateFunctions.oddElements.draftKings,
        })
        await draftKings.updateExchangeGames();
        await draftKings.updateExchangeGameElements();
        await draftKings.updateOutcomes();
        this.add(draftKings);

        const fanDuel = await localModels.Exchange.create({
            name: 'FanDuel',
            url: 'https://sportsbook.fanduel.com/navigation/nba',
            updateExchangeGamesFunction: updateFunctions.exchangeGames.fanDuel,
            updateExchangeGameElementFunction: updateFunctions.exchangeGameElement.fanDuel,
            updateExchangeGameTeamElementFunction: updateFunctions.exchangeGameTeamElement.fanDuel,
            updateExchangeOutcomesFunction: updateFunctions.exchangeOutcomes.fanDuel,
            updateOddElementsFunctions: updateFunctions.oddElements.fanDuel,
        });
        await fanDuel.updateExchangeGames();
        await fanDuel.updateExchangeGameElements();
        await fanDuel.updateOutcomes();
        this.add(fanDuel);

        const sugarHouse = await localModels.Exchange.create({
            name: 'SugarHouse',
            url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches',
            updateExchangeGamesFunction: updateFunctions.exchangeGames.sugarHouse,
            updateExchangeGameElementFunction: updateFunctions.exchangeGameElement.sugarHouse,
            updateExchangeGameTeamElementFunction: updateFunctions.exchangeGameTeamElement.sugarHouse,
            updateExchangeOutcomesFunction: updateFunctions.exchangeOutcomes.sugarHouse,
            updateOddElementsFunctions: updateFunctions.oddElements.sugarHouse,
        });
        await sugarHouse.updateExchangeGames();
        await sugarHouse.updateExchangeGameElements();
        await sugarHouse.updateOutcomes();
        this.add(sugarHouse);

        return this;
    }

    public async updateExchangeGames() {
        for (const exchange of this) {
            await exchange.updateExchangeGames();
        }
    }

    public async updateExchangeGameElements() {
        for (const exchange of this) {
            await exchange.updateExchangeGameElements();
        }
    }

    public async updateExchangeGameTeamElements() {
        for (const exchange of this) {
            await exchange.updateExchangeGameTeamElements();
        }
    }

    public async updateExchangeOutcomes() {
        for (const exchange of this) {
            await exchange.updateExchangeOutcomes();
        }
    }

    public async updateOddElements() {
        for (const exchange of this) {
            await exchange.updateOddElements();
        }
    }
}

export const allExchanges = new AllExchanges();
