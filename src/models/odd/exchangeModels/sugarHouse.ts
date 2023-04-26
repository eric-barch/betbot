import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../global';
import * as localModels from '../../../models';

import { Odd } from '../odd';

abstract class SugarHouseOdd extends Odd {
    private exchangeGame: localModels.SugarHouseExchangeGame;

    constructor({
        exchange,
        outcome,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
    }) {
        super({
            exchange: exchange,
            outcome: outcome,
        });
        const game = this.getOutcome().game;

        const exchangeGame = globalModels.allExchangeGames.find({
            exchange: exchange,
            game: game,
        });

        if (!exchangeGame) {
            throw new Error(`Did not find ExchangeGame.`);
        }

        if (!(exchangeGame instanceof localModels.SugarHouseExchangeGame)) {
            throw new Error(`Expected SugarHouseExchangeGame.`);
        }

        this.exchangeGame = exchangeGame;
    }

    async updateElement(xPath: string): Promise<ElementHandle | null> {
        const exchangeGameElement = this.exchangeGame.element;

        if (!exchangeGameElement) {
            return null;
        }

        const className = await (await exchangeGameElement.getProperty('className')).jsonValue();
        const oddElement = await exchangeGameElement.$(`xpath/${xPath}`);

        if (!oddElement) {
            return null;
        }

        return oddElement;
    }
}

export class SugarHouseSpreadAway extends SugarHouseOdd {
    public priceElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[2]/ul/li';
    public valueElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[1]/button/div[1]';
}

export class SugarHouseSpreadHome extends SugarHouseOdd {
    public priceElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[2]/ul/li';
    public valueElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[1]/div[2]/button/div[1]';
}

export class SugarHouseMoneylineAway extends SugarHouseOdd {
    public priceElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[2]/div[1]/button/div/ul/li';
    public valueElementXPath: null = null;
}

export class SugarHouseMoneylineHome extends SugarHouseOdd {
    public priceElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[2]/div[2]/button/div/ul/li';
    public valueElementXPath: null = null;
}

export class SugarHouseTotalOver extends SugarHouseOdd {
    public priceElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[2]/ul/li';
    public valueElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[1]/button/div[1]';
}

export class SugarHouseTotalUnder extends SugarHouseOdd {
    public priceElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[2]/ul/li';
    public valueElementXPath: string = 'div/div/div/div[1]/div[4]/div/div[3]/div[2]/button/div[1]';
}