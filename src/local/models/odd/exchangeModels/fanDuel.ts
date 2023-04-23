import { ElementHandle } from 'puppeteer';

import { Odd } from '../odd';

abstract class FanDuelOdd extends Odd {
    async updateElement(xPath: string): Promise<ElementHandle | null> {
        // const exchangeGameTeam = this.exchangeGameTeam;

        // if (!exchangeGameTeam) {
        //     return null;
        // }

        // const element = await exchangeGameTeam.$(`xpath/${xPath}`);

        // if (!element) {
        //     return null;
        // }

        // return element;
        return null;
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