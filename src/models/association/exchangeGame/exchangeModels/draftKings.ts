import { ElementHandle } from "puppeteer";

import * as localModels from '../../../../models';

export class DraftKingsExchangeGame extends localModels.ExchangeGame {
    public constructor({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
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