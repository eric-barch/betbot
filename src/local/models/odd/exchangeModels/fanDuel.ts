import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../../local';

import { Odd } from '../odd';

abstract class FanDuelOdd extends Odd {
    private exchangeGameTeam: localModels.ExchangeGameTeam;

    async updateElement(xPath: string): Promise<ElementHandle | null> {
        const exchangeGameTeamElement = this.exchangeGameTeam.element;

        if (!exchangeGameTeamElement) {
            return null;
        }

        const oddElement = await exchangeGameTeamElement.$(`xpath/${xPath}`);

        if (!oddElement) {
            return null;
        }

        return oddElement;
    }
}

export class FanDuelSpreadAway extends FanDuelOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class FanDuelSpreadHome extends FanDuelOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class FanDuelMoneylineAway extends FanDuelOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class FanDuelMoneylineHome extends FanDuelOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class FanDuelTotalOver extends FanDuelOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

export class FanDuelTotalUnder extends FanDuelOdd {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}