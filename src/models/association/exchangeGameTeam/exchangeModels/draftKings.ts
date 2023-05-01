import { ElementHandle } from "puppeteer";

import { ExchangeGameTeam } from '../exchangeGameTeam';
import * as models from '../../../../models';

export abstract class DraftKingsExchangeGameTeam extends ExchangeGameTeam {
    public element: ElementHandle | null;

    public constructor({
        exchange,
        game,
        team,
    }: {
        exchange: models.Exchange,
        game: models.Game,
        team: models.Team,
    }) {
        super({
            exchange: exchange,
            game: game,
            team: team,
        });
        this.element = null;
    }

    public async getTeamRowElements(): Promise<{
        awayTeamRowElement: ElementHandle,
        homeTeamRowElement: ElementHandle,
    } | null> {
        const exchange = this.exchange;
        const game = this.game;

        const page = exchange.connectionManager.page;

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
            return null;
        }
    
        if (matchedTeamRowElements.length > 2) {
            throw new Error(`Did not expect more than 2 teamRowElements for ${exchange.name} ${game.regionAbbrIdentifierAbbr}`);
            // TODO: Handle by confirming time of game.
        }
    
        const awayTeamRowElement = matchedTeamRowElements[0];
        const homeTeamRowElement = matchedTeamRowElements[1];

        return {
            awayTeamRowElement: awayTeamRowElement,
            homeTeamRowElement: homeTeamRowElement,
        };
    }
}

export class DraftKingsExchangeGameAwayTeam extends DraftKingsExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        const teamRowElements = await this.getTeamRowElements();

        if (!teamRowElements) {
            this.element = null;
            return null;
        }

        const element = teamRowElements.awayTeamRowElement;

        this.element = element;
        return element;
    }
}

export class DraftKingsExchangeGameHomeTeam extends DraftKingsExchangeGameTeam {
    public async updateElement(): Promise<ElementHandle | null> {
        const teamRowElements = await this.getTeamRowElements();

        if (!teamRowElements) {
            this.element = null;
            return null;
        }

        const element = teamRowElements.homeTeamRowElement;

        this.element = element;
        return element;
    }
}