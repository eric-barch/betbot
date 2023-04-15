import * as globalModels from '../../../global';
import * as localModels from '../../../local';

class AllExchanges extends localModels.ExchangeSet {
    public async init(): Promise<localModels.ExchangeSet> {
        const draftKings = await localModels.Exchange.create({
            name: 'DraftKings',
            url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
            updateGamesFunction: globalModels.updateGamesFunctions.get('draftKings')!,
            updateStatisticsFunction: globalModels.updateStatisticsFunctions.get('draftKings')!,
        })
        this.add(draftKings);

        const fanDuel = await localModels.Exchange.create({
            name: 'FanDuel',
            url: 'https://sportsbook.fanduel.com/navigation/nba',
            updateGamesFunction: globalModels.updateGamesFunctions.get('fanDuel')!,
            updateStatisticsFunction: globalModels.updateStatisticsFunctions.get('fanDuel')!,
        });
        this.add(fanDuel);

        return this;
    }
}

export const allExchanges = new AllExchanges();
