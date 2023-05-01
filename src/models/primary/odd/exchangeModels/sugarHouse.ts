import { ElementHandle } from 'puppeteer';

import * as global from '../../../../global';
import * as models from '../../..';

import { Odd } from '../odd';

abstract class SugarHouseOdd extends Odd {
    protected abstract priceElementXPathFromExchangeGame: string;
    protected abstract valueElementXPathFromExchangeGame: string | null;
    private exchangeGame: models.SugarHouseExchangeGame;

    constructor({
        exchange,
        outcome,
    }: {
        exchange: models.Exchange,
        outcome: models.Outcome,
    }) {
        super({
            exchange: exchange,
            outcome: outcome,
        });

        const exchangeGame = global.allExchangeGames.find({
            exchange: exchange,
            game: outcome.game,
        });

        if (!exchangeGame) {
            throw new Error(`Did not find ExchangeGame.`);
        }

        if (!(exchangeGame instanceof models.SugarHouseExchangeGame)) {
            throw new Error(`Expected SugarHouseExchangeGame.`);
        }

        this.exchangeGame = exchangeGame;
    }

    protected async getPriceElement(): Promise<ElementHandle | null> {
        const priceElement = await this.getElement(this.priceElementXPathFromExchangeGame);
        this.priceElement = priceElement;
        return priceElement;
    }

    protected async getValueElement(): Promise<ElementHandle | null> {
        const valueElement = await this.getElement(this.valueElementXPathFromExchangeGame);
        this.valueElement = valueElement;
        return valueElement;
    }

    private async getElement(xPathFromExchangeGame: string | null): Promise<ElementHandle | null> {
        const exchangeGameElement = this.exchangeGame.element;

        if (!exchangeGameElement) {
            return null;
        }

        const className = await (await exchangeGameElement.getProperty('className')).jsonValue();
        const oddElement = await exchangeGameElement.$(`xpath/${xPathFromExchangeGame}`);

        if (!oddElement) {
            return null;
        }

        return oddElement;
    }
}

export class SugarHouseSpreadAway extends SugarHouseOdd {
    protected priceElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[2]/ul/li';
    protected valueElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[1]';
}

export class SugarHouseSpreadHome extends SugarHouseOdd {
    protected priceElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[2]/ul/li';
    protected valueElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[1]';
}

export class SugarHouseMoneylineAway extends SugarHouseOdd {
    protected priceElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[2]/div[1]/button/div/ul/li';
    protected valueElementXPathFromExchangeGame: null = null;
}

export class SugarHouseMoneylineHome extends SugarHouseOdd {
    protected priceElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[2]/div[2]/button/div/ul/li';
    protected valueElementXPathFromExchangeGame: null = null;
}

export class SugarHouseTotalOver extends SugarHouseOdd {
    protected priceElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[2]/ul/li';
    protected valueElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[1]';
}

export class SugarHouseTotalUnder extends SugarHouseOdd {
    protected priceElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[2]/ul/li';
    protected valueElementXPathFromExchangeGame: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[1]';
}