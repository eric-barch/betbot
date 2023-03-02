import * as config from '../../config';
import * as models from '..';
import * as initData from '../../initData';

const exportVerbosity = false;
const exportVerbosityBase = 'database.functions';
const verbosity = config.verbosity.models.group['allExchanges.ts'];

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
        const verbose = verbosity.AllExchanges.initialize;
        verbose ? console.log(`\nRunning ${AllExchanges.name}.${this.initialize.name}.`) : null;

        for (const exchange of initData.exchanges) {
            let newExchange = new models.Exchange({
                name: exchange.name, 
                url: exchange.url,
                parseFunction: exchange.parseFunction,
            });
            verbose ? console.log(`Created new ${newExchange.constructor.name} ${newExchange.getName()}.`) : null;

            await newExchange.initialize();
            verbose ? console.log(`Initialized ${newExchange.constructor.name} ${newExchange.getName()}.`) : null;

            await newExchange.analyze();
            verbose ? console.log(`${newExchange.getName()} analyzed.`) : null;
    
            // this.exchanges.push(newExchange);
            // verbose ? console.log(`${newExchange.constructor.name} ${newExchange.getName()} added to ${this.constructor.name}.`) : null;
        }
    }

    public getExchanges() {
        return this.exchanges;
    }
}
exportVerbosity ? console.log(`\nExported ${exportVerbosityBase}.${AllExchanges.name}.`) : null;