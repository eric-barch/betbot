import * as localModels from '../../../local/models';

export class OddSet extends Set<localModels.Odd> {
    public async getOddByExchangeAndGame({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }): Promise<localModels.Odd> {
        let requestedOdd = undefined;

        for (const odd of this) {
            if (odd.matchesByExchangeAndGame({
                exchange: exchange,
                game: game,
            })) {
                requestedOdd = odd;
                break;
            }
        }

        if (requestedOdd === undefined) {
            requestedOdd = await localModels.Odd.create({
                exchange: exchange,
                game: game,
            });
            
            this.add(requestedOdd);
        }

        return requestedOdd;
    }

    public async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}