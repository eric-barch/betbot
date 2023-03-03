import * as config from '../../../../../config';

import { AbstractUtility } from "../abstractUtil";
import { Exchange } from "../../exchange";

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
        await this.parseFunction();
    }
}