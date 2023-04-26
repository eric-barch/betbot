import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../global'
import * as localModels from '../../../models';

import { Odd } from '../odd';

abstract class DraftKingsOdd extends Odd {
    private exchangeGameTeam: localModels.DraftKingsExchangeGameTeam;

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
        })

        if (!exchangeGameTeam) {
            throw new Error(`Did not find ExchangeGameTeam.`);
        }

        if (!(exchangeGameTeam instanceof localModels.DraftKingsExchangeGameTeam)) {
            throw new Error(`Expected DraftKingsExchangeGameTeam.`);
        }

        this.exchangeGameTeam = exchangeGameTeam;
    }

    async updateElement(xPath: string | null): Promise<ElementHandle | null> {
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

export class DraftKingsSpreadAway extends DraftKingsOdd {
    public priceElementXPath: string = 'td[1]/div/div/div/div[2]/div[2]/span';
    public valueElementXPath: string = 'td[1]/div/div/div/div[1]/span';
}

export class DraftKingsSpreadHome extends DraftKingsOdd {
    public priceElementXPath: string = 'td[1]/div/div/div/div[2]/div[2]/span';
    public valueElementXPath: string = 'td[1]/div/div/div/div[1]/span';
}

export class DraftKingsMoneylineAway extends DraftKingsOdd {
    public priceElementXPath: string = 'td[3]/div/div/div/div/div[2]/span';
    public valueElementXPath: null = null;
}

export class DraftKingsMoneylineHome extends DraftKingsOdd {
    public priceElementXPath: string = 'td[3]/div/div/div/div/div[2]/span';
    public valueElementXPath: null = null;
}

export class DraftKingsTotalOver extends DraftKingsOdd {
    public priceElementXPath: string = 'td[2]/div/div/div/div[2]/div[2]/span';
    public valueElementXPath: string = 'td[2]/div/div/div/div[1]/span[3]';
}

export class DraftKingsTotalUnder extends DraftKingsOdd {
    public priceElementXPath: string = 'td[2]/div/div/div/div[2]/div[2]/span';
    public valueElementXPath: string = 'td[2]/div/div/div/div[1]/span[3]';
}