import * as classes from '../../classes';
import * as initData from '../../init-data';
import * as config from '../../_config';

export class AllExchanges {
    private exchanges: Array<classes.exchanges.Exchange>;

    constructor({
        exchanges,
    }: {
        exchanges?: Array<classes.exchanges.Exchange>,
    } = {}) {
        if (exchanges) {
            this.exchanges = exchanges;
        } else {
            this.exchanges = [];
        }
    }

    public async initiate() {
        const verbose = config.verbosity.classes.exchanges.allExchanges.initiate;
        verbose ? console.log(``) : null;

        for (const exchange of initData.exchanges) {
            let newExchange = new classes.exchanges.Exchange({
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