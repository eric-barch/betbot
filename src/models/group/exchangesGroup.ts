import * as config from '../../config';
import * as models from '..';
import * as initData from '../../initData';

export class ExchangesGroup {
    private exchangesArray: Array<models.Exchange>;

    constructor({
        exchanges,
    }: {
        exchanges?: Array<models.Exchange>,
    } = {}) {
        if (exchanges) {
            this.exchangesArray = exchanges;
        } else {
            this.exchangesArray = [];
        }
    }

    public async analyze() {
        for (const exchange of this.exchangesArray) {
            await exchange.analyze();
        }
    }

    public async close() {
        for (const exchange of this.exchangesArray) {
            await exchange.close();
        }
    }
    
    public async connect() {
        for (const exchange of this.exchangesArray) {
            await exchange.connect();
        }
    }

    public async initialize() {
        for (const exchange of initData.exchanges) {
            let newExchange = new models.Exchange({
                name: exchange.name, 
                url: exchange.url,
                parseFunction: exchange.parseFunction,
            });

            await newExchange.initialize();
    
            this.exchangesArray.push(newExchange);
        }
    }

    public getExchanges() {
        return this.exchangesArray;
    }

    public push({
        exchange,
    }: {
        exchange: models.Exchange,
    }) {
        this.exchangesArray.push(exchange);
    }
}