import { ElementHandle } from 'puppeteer';

import * as interfaces from './interfaces';

import { Odd } from './odd';

export class DraftKingsOddFactory implements interfaces.OddFactory {
    public createSpreadAway(): interfaces.SpreadAway {
        return new DraftKingsSpreadAway();
    }

    public createSpreadHome(): interfaces.SpreadHome {
        return new DraftKingsSpreadHome();
    }

    public createMoneylineAway(): interfaces.MoneylineAway {
        return new DraftKingsMoneylineAway();
    }

    public createMoneylineHome(): interfaces.MoneylineHome {
        return new DraftKingsMoneylineHome();
    }

    public createTotalOver(): interfaces.TotalOver {
        return new DraftKingsTotalOver();
    }

    public createTotalUnder(): interfaces.TotalUnder {
        return new DraftKingsTotalUnder();
    }
}

abstract class DraftKingsOdd extends Odd {
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

class DraftKingsSpreadAway extends DraftKingsOdd implements interfaces.SpreadAway {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class DraftKingsSpreadHome extends DraftKingsOdd implements interfaces.SpreadHome {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class DraftKingsMoneylineAway extends DraftKingsOdd implements interfaces.MoneylineAway {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class DraftKingsMoneylineHome extends DraftKingsOdd implements interfaces.MoneylineHome {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class DraftKingsTotalOver extends DraftKingsOdd implements interfaces.TotalOver {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}

class DraftKingsTotalUnder extends DraftKingsOdd implements interfaces.TotalUnder {
    public priceElementXPath: string = '';
    public valueElementXPath: string = '';
}