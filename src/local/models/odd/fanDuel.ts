import { ElementHandle } from 'puppeteer';

import * as interfaces from './interfaces';

import { Odd } from './odd';

export class FanDuelOddFactory implements interfaces.OddFactory {
    public createSpreadAway(): interfaces.SpreadAway {
        return new FanDuelSpreadAway();
    }

    public createSpreadHome(): interfaces.SpreadHome {
        return new FanDuelSpreadHome();
    }

    public createMoneylineAway(): interfaces.MoneylineAway {
        return new FanDuelMoneylineAway();
    }

    public createMoneylineHome(): interfaces.MoneylineHome {
        return new FanDuelMoneylineHome();
    }

    public createTotalOver(): interfaces.TotalOver {
        return new FanDuelTotalOver();
    }

    public createTotalUnder(): interfaces.TotalUnder {
        return new FanDuelTotalUnder();
    }
}

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

class FanDuelSpreadAway extends FanDuelOdd implements interfaces.SpreadAway {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class FanDuelSpreadHome extends FanDuelOdd implements interfaces.SpreadHome {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class FanDuelMoneylineAway extends FanDuelOdd implements interfaces.MoneylineAway {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class FanDuelMoneylineHome extends FanDuelOdd implements interfaces.MoneylineHome {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class FanDuelTotalOver extends FanDuelOdd implements interfaces.TotalOver {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class FanDuelTotalUnder extends FanDuelOdd implements interfaces.TotalUnder {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}