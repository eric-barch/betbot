import { ElementHandle } from "puppeteer";

import { ExchangeGame } from "../exchangeGame";

export class DraftKingsExchangeGame extends ExchangeGame {
    public async updateElement(): Promise<ElementHandle | null> {
        return null;
    }
}