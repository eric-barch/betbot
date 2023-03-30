import * as global from '../../global';
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
        if (global.allExchanges !== undefined) {
            if (this === global.allExchanges) {
                // Some code to add to or update MySQL.
            } else {
                global.allExchanges.add(exchange);
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