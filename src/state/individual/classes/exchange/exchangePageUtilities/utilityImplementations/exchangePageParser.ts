import { AbstractUtility } from '../abstractUtility';
import * as state from '../../../../../../state';

export class ExchangePageParser extends AbstractUtility {
    private parseFunction: Function;

    constructor({
        exchange,
        parseFunction,
    }: {
        exchange: state.Exchange,
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