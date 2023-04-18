import { ElementHandle } from 'puppeteer';

import * as localModels from '../../local';

export async function sugarHouse(this: localModels.ExchangeGame): Promise<ElementHandle | null> {
    const exchange = this.exchange;
    const game = this.game;

    const page = exchange.page;

    const awayTeamIdentifier = game.awayTeam.identifierFull.toLowerCase();
    const homeTeamIdentifier = game.homeTeam.identifierFull.toLowerCase();

    const gameTitleElements = await page.$$(
        `article > div > div[aria-label*="${awayTeamIdentifier}" i][aria-label*="${homeTeamIdentifier}" i]`
    );

    if (gameTitleElements.length < 1) {
        this.element = null;
        return null;
    }

    if (gameTitleElements.length > 1) {
        throw new Error(`Did not expect more than 1 gameTitleElement for ${exchange.name} ${game.regionAbbrIdentifierAbbr}`);
    }

    const gameElement = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');
    const gameElementClassName = await (await gameElement.getProperty('className')).jsonValue();

    if (!(gameElement instanceof ElementHandle)) {
        this.element = null;
        return null;
    }

    this.element = gameElement;
    return gameElement;
}