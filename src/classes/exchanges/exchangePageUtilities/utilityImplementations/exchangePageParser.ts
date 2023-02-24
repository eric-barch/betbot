import * as classes from '../../../../classes';

export class ExchangePageParser extends classes.AbstractUtility {
    private parseFunction: Function;

    constructor({
        exchange,
        parseFunction,
    }: {
        exchange: classes.Exchange,
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