import * as models from '../../models';

export class OddsSet extends Set<models.Odds> {
    add(odds: models.Odds): this {
        if (this !== models.allOdds) {
            models.allOdds.add(odds);
        }

        return super.add(odds);
    }

    public getOddsByExchangeAndGame({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }): models.Odds {
        let requestedOdds = undefined;

        for (const odds of this) {
            if (odds.matchesByExchangeAndGame({
                exchange: exchange,
                game: game,
            })) {
                requestedOdds = odds;
                break;
            }
        }

        if (requestedOdds === undefined) {
            requestedOdds = new models.Odds({
                exchange: exchange,
                game: game,
            });
            this.add(requestedOdds);
        }

        return requestedOdds;
    }
}