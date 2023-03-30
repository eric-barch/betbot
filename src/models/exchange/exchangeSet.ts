import * as models from '../../models';

// export class ExchangeSet extends ItemSet<Exchange> {
//     public async analyze() {
//         for (const exchange of this) {
//             const exchangeOdds = await exchange.analyze();
//         }
//     }

//     public async close() {
//         for (const exchange of this) {
//             await exchange.close();
//         }
//     }
// }

export class ExchangeSet extends Set<models.Exchange> {
    public async initialize() {
        for (const exchange of this) {
            await exchange.initialize();
        }
    }

    add(exchange: models.Exchange): this {
        if (models.allExchanges !== undefined) {
            if (this === models.allExchanges) {
                // Some code to add to or update MySQL.
            } else {
                models.allExchanges.add(exchange);
            }
        }

        return super.add(exchange);
    }

    public async analyze() {
        for (const exchange of this) {
            const exchangeOdds = await exchange.analyze();
        }
    }

    public async close() {
        for (const exchange of this) {
            await exchange.close();
        }
    }
}