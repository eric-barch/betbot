import * as models from '../../../../../models';

export class ExchangePageParser extends models.AbstractUtility {
    private parseFunction: Function;

    constructor({
        exchange,
        parseFunction,
    }: {
        exchange: models.Exchange,
        parseFunction: Function,
    }) {
        super({exchange: exchange});
        this.parseFunction = parseFunction.bind(this);
    }

    async parse() {
        await this.parseFunction();
    }

}