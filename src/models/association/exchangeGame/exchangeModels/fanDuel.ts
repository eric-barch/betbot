import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../models';

export class FanDuelExchangeGame extends localModels.ExchangeGame {
    public element: ElementHandle | null;

    constructor({
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

        this.element = null;
    }

    public async updateElement(): Promise<ElementHandle | null> {
        const exchange = this.exchange;
        const game = this.game;

        const page = exchange.connectionManager.page;

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