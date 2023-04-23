import { ElementHandle } from "puppeteer";

import { ExchangeGame } from "../exchangeGame";

import * as localModels from '../../../../local';

export class DraftKingsExchangeGame extends ExchangeGame {
    public async updateElement(): Promise<ElementHandle | null> {
        this.element = null;
        return null;
    }
}