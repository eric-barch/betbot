import { ElementHandle } from "puppeteer";

import { ExchangeGame } from "../exchangeGame";

export class SugarHouseExchangeGame extends ExchangeGame {
    public element: ElementHandle | null = null;

    public async updateElement(): Promise<ElementHandle | null> {
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