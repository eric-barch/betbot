import { ElementHandle } from "puppeteer";

import * as models from '../../../../models';

export class DraftKingsExchangeGame extends models.ExchangeGame {
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