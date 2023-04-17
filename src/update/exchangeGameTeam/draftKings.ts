import { ElementHandle } from 'puppeteer';

import * as localModels from '../../local';

export async function draftKings(this: localModels.ExchangeGameTeam): Promise<ElementHandle | null> {
    const exchange = this.exchangeGame.exchange;
    const game = this.exchangeGame.game;
    const team = this.team;

    const page = exchange.page;

    const teamRowElements = await page.$$('tbody > tr');

    const awayTeamIdentifier = game.awayTeam.identifierFull.toLowerCase();
    const homeTeamIdentifier = game.homeTeam.identifierFull.toLowerCase();

    const matchedTeamRowElements = [];

    for (const teamRow of teamRowElements) {
        const aElement = await teamRow.$('th > a.event-cell-link');

        if (!aElement) {
            continue;
        }

        const hrefString = await (await aElement.getProperty('href')).jsonValue();
        const hrefStringClean = hrefString.trim().toLowerCase();

        if (hrefStringClean.includes(awayTeamIdentifier) && hrefStringClean.includes(homeTeamIdentifier)) {
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
    const homeTeamRowElement = matchedTeamRowElements[1];

    if (team === game.awayTeam) {
        this.element = awayTeamRowElement;
        return awayTeamRowElement;
    }
    
    if (team === game.homeTeam) {
        this.element = homeTeamRowElement;
        return homeTeamRowElement;
    }

    throw new Error(`Provided team does not match the away or home team.`);
}