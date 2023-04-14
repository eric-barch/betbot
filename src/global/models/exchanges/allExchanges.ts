import * as localModels from '../../../local';

class AllExchanges extends localModels.ExchangeSet {
    public async init(): Promise<localModels.ExchangeSet> {
        const draftKings = await localModels.Exchange.create({
            name: 'DraftKings',
            url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
        })
        this.add(draftKings);

        const fanDuel = await localModels.Exchange.create({
            name: 'FanDuel',
            url: 'https://sportsbook.fanduel.com/navigation/nba',
        });
        this.add(fanDuel);

        return this;
    }
}

export const allExchanges = new AllExchanges();
