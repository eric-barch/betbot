import * as models from '..';
import * as initData from '../../initData';

export class AllExchanges {
    private exchanges: Array<models.Exchange>;

    constructor({
        exchanges,
    }: {
        exchanges?: Array<models.Exchange>,
    } = {}) {
        if (exchanges) {
            this.exchanges = exchanges;
        } else {
            this.exchanges = [];
        }
    }

    public async analyze() {
        for (const exchange of this.exchanges) {
            await exchange.analyze();
        }
    }

    public async close() {
        for (const exchange of this.exchanges) {
            await exchange.close();
        }
    }
    
    public async connect() {
        for (const exchange of this.exchanges) {
            await exchange.connect();
        }
    }

    public async initialize() {
        const verbose = false;

        for (const exchange of initData.exchanges) {
            let newExchange = new models.Exchange({
                name: exchange.name, 
                url: exchange.url,
                parseFunction: exchange.parseFunction,
            });

            await newExchange.initialize();

            const pageReader = newExchange.getPageReader();
            await pageReader.connect();

            await newExchange.analyze();
    
            this.exchanges.push(newExchange);
        }
    }

    public getExchanges() {
        return this.exchanges;
    }
}