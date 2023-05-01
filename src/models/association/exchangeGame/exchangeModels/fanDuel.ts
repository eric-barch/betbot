import { ElementHandle } from 'puppeteer';

import { ExchangeGame } from '../exchangeGame';
import * as models from '../../../../models';

export class FanDuelExchangeGame extends ExchangeGame {
    public element: ElementHandle | null;

    constructor({
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

        this.element = null;
    }

    public async updateElement(): Promise<ElementHandle | null> {
        const page = this.exchange.connectionManager.page;

        const gameTitleElements = await page.$$(`[title="${this.game.regionFullIdentifierFull}"]`);

        if (gameTitleElements.length < 2) {
            this.element = null;
            return null;
        }
    
        if (gameTitleElements.length > 2) {
            throw new Error(`Did not expect more than 2 gameTitleElements for ${this.exchange.name} ${this.game.regionAbbrIdentifierAbbr}`);
            // TODO: Handle by confirming time.
        }

        const element = await (await gameTitleElements[0].getProperty('parentElement')).getProperty('parentElement');

        if (!(element instanceof ElementHandle)) {
            this.element = null;
            return null;
        }
    
        this.element = element;
        return element;
    }
}