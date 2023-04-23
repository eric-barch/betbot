import { ElementHandle } from 'puppeteer';

import * as localModels from '../../..';

import { Odd } from '../odd';

abstract class DraftKingsOdd extends Odd {
    async updateElement(xPath: string | null): Promise<ElementHandle | null> {
        if (!xPath) {
            return null;
        }

        const exchange = this.getExchange();
        const game = this.getOutcome().game;

        const outcomeName = this.getOutcome().name;
        let team: localModels.Team | null = null;

        if (outcomeName.includes('away') || outcomeName.includes('over')) {
            team = game.awayTeam;
        }

        if (outcomeName.includes('home') || outcomeName.includes('under')) {
            team = game.homeTeam;
        }

        if (!team) {
            return null;
        }

        const exchangeGame = await exchange.getExchangeGames().findOrCreate({
            exchange: exchange,
            game: game,
        });

        let exchangeGameTeam;

        if (outcomeName.includes('away') || outcomeName.includes('over')) {
            exchangeGameTeam = exchangeGame.getExchangeGameAwayTeam();
        } else if (outcomeName.includes('home') || outcomeName.includes('under')) {
            exchangeGameTeam = exchangeGame.getExchangeGameHomeTeam();
        }

        if (!(exchangeGameTeam instanceof localModels.ExchangeGameTeam)) {
            throw new Error(`Come back to this and refactor pls.`);
        }

        const exchangeGameTeamElement = exchangeGameTeam.element;
        const className = await (await exchangeGameTeamElement?.getProperty('className'))?.jsonValue();

        if (!exchangeGameTeamElement) {
            return null;
        }

        const element = await exchangeGameTeamElement.$(`xpath/${xPath}`);
        const json = await (await element?.getProperty('textContent'))?.jsonValue();

        if (!element) {
            return null;
        }

        return element;
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