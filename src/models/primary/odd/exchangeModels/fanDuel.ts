import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../../global';
import * as localModels from '../../..';

import { Odd } from '../odd';

abstract class FanDuelOdd extends Odd {
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

    async updateElement(xPath: string): Promise<ElementHandle | null> {
        const exchangeGameTeamElement = this.exchangeGameTeam.element;

        if (!exchangeGameTeamElement) {
            return null;
        }

        const className = await (await exchangeGameTeamElement.getProperty('className')).jsonValue();

        const oddElement = await exchangeGameTeamElement.$(`xpath/${xPath}`);

        if (!oddElement) {
            return null;
        }

        return oddElement;
    }
}

export class FanDuelSpreadAway extends FanDuelOdd {
    public priceElementXPath: string = 'div[1]/span[2]';
    public valueElementXPath: string = 'div[1]/span[1]';
}

export class FanDuelSpreadHome extends FanDuelOdd {
    public priceElementXPath: string = 'div[1]/span[2]';
    public valueElementXPath: string = 'div[1]/span[1]';
}

export class FanDuelMoneylineAway extends FanDuelOdd {
    public priceElementXPath: string = 'div[2]/span';
    public valueElementXPath: null = null;
}

export class FanDuelMoneylineHome extends FanDuelOdd {
    public priceElementXPath: string = 'div[2]/span';
    public valueElementXPath: null = null;
}

export class FanDuelTotalOver extends FanDuelOdd {
    public priceElementXPath: string = 'div[3]/span[2]';
    public valueElementXPath: string = 'div[3]/span[1]';
}

export class FanDuelTotalUnder extends FanDuelOdd {
    public priceElementXPath: string = 'div[3]/span[2]';
    public valueElementXPath: string = 'div[3]/span[1]';
}