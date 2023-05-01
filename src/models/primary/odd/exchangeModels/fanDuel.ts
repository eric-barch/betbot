import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../../global';
import * as localModels from '../../..';

import { Odd } from '../odd';

abstract class FanDuelOdd extends Odd {
    protected abstract priceElementXPathFromExchangeGameTeam: string;
    protected abstract valueElementXPathFromExchangeGameTeam: string | null;
    private exchangeGameTeam: localModels.FanDuelExchangeGameTeam;

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

        const exchangeGameTeam = globalModels.allExchangeGameTeams.find({
            exchange: exchange,
            game: outcome.game,
            team: outcome.team,
        });

        if (!exchangeGameTeam) {
            throw new Error(`Did not find ExchangeGameTeam.`);
        }

        if (!(exchangeGameTeam instanceof localModels.FanDuelExchangeGameTeam)) {
            throw new Error(`Expected FanDuelExchangeGameTeam.`);
        }

        this.exchangeGameTeam = exchangeGameTeam;
    }

    protected async getPriceElement(): Promise<ElementHandle | null> {
        const priceElement = await this.getElement(this.priceElementXPathFromExchangeGameTeam);
        this.priceElement = priceElement;
        return priceElement;
    }

    protected async getValueElement(): Promise<ElementHandle | null> {
        const valueElement = await this.getElement(this.valueElementXPathFromExchangeGameTeam);
        this.valueElement = valueElement;
        return valueElement;
    }

    private async getElement(xPathFromExchangeGameTeam: string | null): Promise<ElementHandle | null> {
        if (!xPathFromExchangeGameTeam) {
            return null;
        }
        
        const exchangeGameTeamElement = this.exchangeGameTeam.element;

        if (!exchangeGameTeamElement) {
            return null;
        }

        const oddElement = await exchangeGameTeamElement.$(`xpath/${xPathFromExchangeGameTeam}`);

        if (!oddElement) {
            return null;
        }

        return oddElement;
    }
}

export class FanDuelSpreadAway extends FanDuelOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'div[1]/span[2]';
    protected valueElementXPathFromExchangeGameTeam: string = 'div[1]/span[1]';
}

export class FanDuelSpreadHome extends FanDuelOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'div[1]/span[2]';
    protected valueElementXPathFromExchangeGameTeam: string = 'div[1]/span[1]';
}

export class FanDuelMoneylineAway extends FanDuelOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: null = null;
}

export class FanDuelMoneylineHome extends FanDuelOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: null = null;
}

export class FanDuelTotalOver extends FanDuelOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'div[3]/span[2]';
    protected valueElementXPathFromExchangeGameTeam: string = 'div[3]/span[1]';
}

export class FanDuelTotalUnder extends FanDuelOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'div[3]/span[2]';
    protected valueElementXPathFromExchangeGameTeam: string = 'div[3]/span[1]';
}