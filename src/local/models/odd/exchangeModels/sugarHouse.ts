import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../local';

import { Odd } from '../odd';

abstract class SugarHouseOdd extends Odd {
    private exchangeGame: localModels.ExchangeGame;

    async updateElement(xPath: string): Promise<ElementHandle | null> {
        const exchangeGameElement = this.exchangeGame.element;

        if (!exchangeGameElement) {
            return null;
        }

        const oddElement = await exchangeGameElement.$(`xpath/${xPath}`);

        if (!oddElement) {
            return null;
        }

        return oddElement;
    }
}

export class SugarHouseSpreadAway extends SugarHouseOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class SugarHouseSpreadHome extends SugarHouseOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class SugarHouseMoneylineAway extends SugarHouseOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class SugarHouseMoneylineHome extends SugarHouseOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class SugarHouseTotalOver extends SugarHouseOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class SugarHouseTotalUnder extends SugarHouseOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}