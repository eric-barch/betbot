import { ElementHandle } from "puppeteer";

import { ExchangeGame } from "../exchangeGame";

export class FanDuelExchangeGame extends ExchangeGame {
    public element: ElementHandle | null = null;

    public async updateElement(): Promise<ElementHandle | null> {
        const exchange = this.getExchange();
        const game = this.getGame();

        const page = exchange.page;

        const gameTitleElements = await page.$$(`[title="${game.regionFullIdentifierFull}"]`);

        if (gameTitleElements.length < 2) {
            this.element = null;
            return null;
        }
    
        if (gameTitleElements.length > 2) {
            throw new Error(`Did not expect more than 2 gameTitleElements for ${exchange.name} ${game.regionAbbrIdentifierAbbr}`);
            // TODO: Handle by confirming time.
        }

        const element = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');
        const elementClassName = await (await element.getProperty('className')).jsonValue();

        if (!(element instanceof ElementHandle)) {
            this.element = null;
            return null;
        }
    
        this.element = element;
        return element;
    }
}