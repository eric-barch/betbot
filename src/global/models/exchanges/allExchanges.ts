import * as localModels from '../../../local';
import * as updateFunctions from '../../../update';

class AllExchanges extends localModels.ExchangeSet {
    public async init(): Promise<localModels.ExchangeSet> {
        const draftKings = await localModels.Exchange.create({
            name: 'DraftKings',
            url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
            updateExchangeGamesFunction: updateFunctions.game.draftKings,
            updateExchangeGameElementFunction: updateFunctions.exchangeGame.draftKings,
            updateExchangeGameTeamElementFunction: updateFunctions.exchangeGameTeam.draftKings,
            updateExchangeOutcomesFunction: updateFunctions.outcome.draftKings,
            updateOddElementsFunctions: updateFunctions.odd.draftKings,
        })
        await draftKings.updateExchangeGames();
        await draftKings.updateExchangeGameElements();
        await draftKings.updateOutcomes();
        this.add(draftKings);

        const fanDuel = await localModels.Exchange.create({
            name: 'FanDuel',
            url: 'https://sportsbook.fanduel.com/navigation/nba',
            updateExchangeGamesFunction: updateFunctions.game.fanDuel,
            updateExchangeGameElementFunction: updateFunctions.exchangeGame.fanDuel,
            updateExchangeGameTeamElementFunction: updateFunctions.exchangeGameTeam.fanDuel,
            updateExchangeOutcomesFunction: updateFunctions.outcome.fanDuel,
            updateOddElementsFunctions: updateFunctions.odd.fanDuel,
        });
        await fanDuel.updateExchangeGames();
        await fanDuel.updateExchangeGameElements();
        await fanDuel.updateOutcomes();
        this.add(fanDuel);

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
