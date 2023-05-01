import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../../global'
import * as localModels from '../../..';

import { Odd } from '../odd';

abstract class DraftKingsOdd extends Odd {
    protected abstract priceElementXPathFromExchangeGameTeam: string;
    protected abstract valueElementXPathFromExchangeGameTeam: string | null;
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

export class DraftKingsSpreadAway extends DraftKingsOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'td[1]/div/div/div/div[2]/div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: string = 'td[1]/div/div/div/div[1]/span';
}

export class DraftKingsSpreadHome extends DraftKingsOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'td[1]/div/div/div/div[2]/div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: string = 'td[1]/div/div/div/div[1]/span';
}

export class DraftKingsMoneylineAway extends DraftKingsOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'td[3]/div/div/div/div/div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: null = null;
}

export class DraftKingsMoneylineHome extends DraftKingsOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'td[3]/div/div/div/div/div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: null = null;
}

export class DraftKingsTotalOver extends DraftKingsOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'td[2]/div/div/div/div[2]/div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: string = 'td[2]/div/div/div/div[1]/span[3]';
}

export class DraftKingsTotalUnder extends DraftKingsOdd {
    protected priceElementXPathFromExchangeGameTeam: string = 'td[2]/div/div/div/div[2]/div[2]/span';
    protected valueElementXPathFromExchangeGameTeam: string = 'td[2]/div/div/div/div[1]/span[3]';
}