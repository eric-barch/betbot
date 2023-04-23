import { ElementHandle } from "puppeteer";

import { ExchangeGameTeam } from "../exchangeGameTeam";

import * as localModels from '../../../../local';

export class DraftKingsExchangeGameAwayTeam extends ExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        const exchange = this.getExchangeGame().getExchange();
        const game = this.getExchangeGame().getGame();
        const page = exchange.page;

        const teamRowElements = await page.$$('tbody > tr');

        const awayTeamIdentifier = game.awayTeam.identifierFull.toLowerCase();
        const homeTeamIdentifier = game.homeTeam.identifierFull.toLowerCase();
    
        const regex = new RegExp(`${awayTeamIdentifier}.*${homeTeamIdentifier}`);
    
        const matchedTeamRowElements = [];

        for (const teamRow of teamRowElements) {
            const aElement = await teamRow.$('th > a.event-cell-link');
    
            if (!aElement) {
                continue;
            }
    
            const hrefString = await (await aElement.getProperty('href')).jsonValue();
            const hrefStringClean = hrefString.trim().toLowerCase();
    
            if (regex.test(hrefStringClean)) {
                matchedTeamRowElements.push(teamRow);
            }
        }

        if (matchedTeamRowElements.length < 2) {
            this.element = null;
            return null;
        }
    
        if (matchedTeamRowElements.length > 2) {
            throw new Error(`Did not expect more than 2 teamRowElements for ${exchange.name} ${game.regionAbbrIdentifierAbbr}`);
            // TODO: Handle by confirming time of game.
        }
    
        const awayTeamRowElement = matchedTeamRowElements[0];
    
        if (!awayTeamRowElement) {
            throw new Error(`Provided team does not match.`);
        }

        this.element = awayTeamRowElement;
        return awayTeamRowElement;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameAwayTeam(this);
    }
}

export class DraftKingsExchangeGameHomeTeam extends ExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        const exchange = this.getExchangeGame().getExchange();
        const game = this.getExchangeGame().getGame();
        const page = exchange.page;

        const teamRowElements = await page.$$('tbody > tr');

        const awayTeamIdentifier = game.awayTeam.identifierFull.toLowerCase();
        const homeTeamIdentifier = game.homeTeam.identifierFull.toLowerCase();
    
        const regex = new RegExp(`${awayTeamIdentifier}.*${homeTeamIdentifier}`);
    
        const matchedTeamRowElements = [];

        for (const teamRow of teamRowElements) {
            const aElement = await teamRow.$('th > a.event-cell-link');
    
            if (!aElement) {
                continue;
            }
    
            const hrefString = await (await aElement.getProperty('href')).jsonValue();
            const hrefStringClean = hrefString.trim().toLowerCase();
    
            if (regex.test(hrefStringClean)) {
                matchedTeamRowElements.push(teamRow);
            }
        }

        if (matchedTeamRowElements.length < 2) {
            this.element = null;
            return null;
        }
    
        if (matchedTeamRowElements.length > 2) {
            throw new Error(`Did not expect more than 2 teamRowElements for ${exchange.name} ${game.regionAbbrIdentifierAbbr}`);
            // TODO: Handle by confirming time of game.
        }

        const homeTeamRowElement = matchedTeamRowElements[1];
        
        if (!homeTeamRowElement) {
            throw new Error(`Provided team does not match.`);
        }

        this.element = homeTeamRowElement;
        return homeTeamRowElement;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
        exchangeGame.setExchangeGameHomeTeam(this);
    }
}