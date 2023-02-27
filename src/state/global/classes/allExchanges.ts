import * as state from '../../../state';
import * as initData from '../../../initData';
import * as config from '../../../_config';

export class AllExchanges {
    private exchanges: Array<state.Exchange>;

    constructor({
        exchanges,
    }: {
        exchanges?: Array<state.Exchange>,
    } = {}) {
        if (exchanges) {
            this.exchanges = exchanges;
        } else {
            this.exchanges = [];
        }
    }

    public async initiate() {
        const verbose = true;
        verbose ? console.log(``) : null;

        for (const exchange of initData.exchanges) {
            let newExchange = new state.Exchange({
                name: exchange.name, 
                url: exchange.url,
                parseFunction: exchange.parseFunction,
            });
    
            await newExchange.initialize({
                headless: config.headless,
            });
    
            this.exchanges.push(newExchange);
            verbose ? console.log(`${newExchange.getName()} added to state.exchanges.`) : null;
        }
    
        verbose ? console.log(`${this.exchanges.length} exchange(s) initialized within state.`) : null;
    }
}