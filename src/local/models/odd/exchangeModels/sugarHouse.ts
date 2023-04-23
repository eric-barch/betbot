import { ElementHandle } from 'puppeteer';

import { Odd } from '../odd';

abstract class SugarHouseOdd extends Odd {
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