import * as config from '../../../../../config';

import { AbstractUtility } from "../abstractUtil";
import { Exchange } from "../../exchange";

const verbosity = config.verbosity.models.individual.exchange.utils.utilImplementations['exchangePageParser.ts'];

export class ExchangePageParser extends AbstractUtility {
    private parseFunction: Function;

    constructor({
        exchange,
        parseFunction,
    }: {
        exchange: Exchange,
        parseFunction: Function,
    }) {
        super({exchange: exchange});
        this.parseFunction = parseFunction.bind(this);
    }

    async parse() {
        const verbose = verbosity.parse;

        await this.parseFunction();
        verbose ? console.log(`Ran ${this.getExchange().getName()}.${this.parse}.`) : null;
    }
}