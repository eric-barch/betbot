import * as classes from '../../../../classes';

export class ExchangePageParser extends classes.exchanges.exchangePageUtilities.AbstractUtility {
    private parseFunction: Function;

    constructor({
        exchange,
        parseFunction,
    }: {
        exchange: classes.exchanges.Exchange,
        parseFunction: Function,
    }) {
        super({exchange: exchange});
        this.parseFunction = parseFunction.bind(this);
    }

    async parse({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        await this.parseFunction({verbose: verbose});
    }

}