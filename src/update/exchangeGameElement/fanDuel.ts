import { ElementHandle } from 'puppeteer';

import * as localModels from '../../local';

export async function fanDuel(this: localModels.ExchangeGame): Promise<ElementHandle | null> {
    const exchange = this.exchange;
    const game = this.game;

    const page = exchange.page;

    const gameTitleElements = await page.$$(`[title="${game.regionFullIdentifierFull}"]`)

    if (gameTitleElements.length < 2) {
        this.element = null;
        return null;
    }

    if (gameTitleElements.length > 2) {
        throw new Error(`Did not expect more than 2 gameTitleElements for ${exchange.name} ${game.regionAbbrIdentifierAbbr}`);
        // TODO: Handle by confirming time.
    }

    const gameElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');

    if (!(gameElement instanceof ElementHandle)) {
        this.element = null;
        return null;
    }

    this.element = gameElement;
    return gameElement;
}