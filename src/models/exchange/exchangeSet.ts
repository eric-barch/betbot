import { allExchanges } from "./allExchanges";
import { Exchange } from "./exchange";

export class ExchangeSet extends Set<Exchange> {
    constructor() {
        super();
    } 

    add(exchange: Exchange): this {
        return super.add(exchange);
    }

    public async analyze() {
        for (const exchange of this) {
            await exchange.analyze();
        }
    }

    public async close() {
        for (const exchange of this) {
            await exchange.close();
        }
    }

    public async initialize() {
        for (const exchange of this) {
            await exchange.initialize();
        }
    }
}