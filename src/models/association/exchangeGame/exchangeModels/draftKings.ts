import { ElementHandle } from "puppeteer";

import { ExchangeGame } from '../exchangeGame';
import * as models from '../../../../models';

export class DraftKingsExchangeGame extends ExchangeGame {
    public constructor({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }) {
        super({
            exchange: exchange,
            game: game,
        });
    }

    public async updateElement(): Promise<ElementHandle | null> {
        return null;
    }
}