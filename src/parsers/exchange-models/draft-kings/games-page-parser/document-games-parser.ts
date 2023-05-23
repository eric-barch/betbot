import * as c from 'chrono-node';
import * as p from 'puppeteer';

import * as baseModels from '../../../base-models';
import * as db from '../../../../db';

interface MatchupTeams {
    awayTeam: db.models.Team;
    homeTeam: db.models.Team;
}

export class DocumentGamesParser {
    private gamesPageParser: baseModels.GamesPageParser;

    constructor({
        gamesPageParser,
    }: {
        gamesPageParser: baseModels.GamesPageParser,
    }) {
        this.gamesPageParser = gamesPageParser;
    }

    public async getGames(): Promise<Array<db.models.Game>> {
        const games = new Array<db.models.Game>;

        const thElements = await this.gamesPageParser.page.$$('th.sportsbook-table__column-row[scope="row"]');

        for (const thElement of thElements) {
            const thElementTeam = await this.getTeam({ thElement });
            const matchupTeams = await this.getMatchupTeams({ thElement });

            const awayTeam = matchupTeams.awayTeam;
            const homeTeam = matchupTeams.homeTeam;

            /**startDate is determined from the away team thElement, so if we have the home team
             * thElement we do nothing with it and continue to the next thElement. */
            if (thElementTeam.id === homeTeam.id) {
                continue;
            }

            if (thElementTeam.id !== awayTeam.id) {
                throw new Error(`thElementTeam.id does not match away team id.`);
            }

            const startDate = await this.getStartDate({ thElement });

            const game = await db.models.Game.findOrCreateByAwayTeamHomeTeamStartDate({
                awayTeam,
                homeTeam,
                startDate,
            });

            games.push(game);
        }

        return games;
    }

    private async getTeam({
        thElement,
    }: {
        thElement: p.ElementHandle,
    }): Promise<db.models.Team> {
        const teamNameElement = await thElement.$('.event-cell__name-text');

        if (!teamNameElement) {
            throw new Error(`teamNameElement is null.`);
        }

        const unformattedName = await (await teamNameElement.getProperty('textContent')).jsonValue();

        if (!unformattedName) {
            throw new Error(`unformattedName is null.`);
        }

        const team = await db.models.Team.findByUnformattedName({ unformattedName });

        return team;
    }

    private async getMatchupTeams({
        thElement,
    }: {
        thElement: p.ElementHandle,
    }): Promise<MatchupTeams> {
        const matchupString = await this.getMatchupString({ thElement });

        const awayTeamNamePattern = new RegExp('/([^/]*)%40');
        const homeTeamNamePattern = new RegExp('%40([^/]*)/');

        const awayTeamNameMatches = matchupString.match(awayTeamNamePattern);
        const homeTeamNameMatches = matchupString.match(homeTeamNamePattern);

        if (!awayTeamNameMatches) {
            throw new Error(`awayTeamName is null.`);
        }

        if (!homeTeamNameMatches) {
            throw new Error(`homeTeamName is null.`);
        }

        const awayTeam = await db.models.Team.findByUnformattedName({
            unformattedName: awayTeamNameMatches[0],
        });

        const homeTeam = await db.models.Team.findByUnformattedName({
            unformattedName: homeTeamNameMatches[0],
        });

        return {
            awayTeam,
            homeTeam,
        }
    }

    private async getMatchupString({
        thElement,
    }: {
        thElement: p.ElementHandle,
    }): Promise<string> {
        const aElement = await thElement.$('.event-cell-link');

        if (!aElement) {
            throw new Error(`aElement is null.`);
        }
        
        const hrefString = await (await aElement.getProperty('href')).jsonValue();

        if (typeof hrefString !== 'string') {
            throw new Error(`hrefString is not a string.`);
        }

        const matchupPattern = new RegExp('/[^/]*%40[^/]*/');
        const matchupStrings = hrefString.match(matchupPattern);

        if (!matchupStrings) {
            throw new Error(`matchupStrings is null.`);
        }

        const matchupString = matchupStrings[0];

        return matchupString;
    }

    private async getStartDate({
        thElement,
    }: {
        thElement: p.ElementHandle,
    }) {
        const dateString = await this.getDateString({ thElement });
        const timeString = await this.getTimeString({ thElement });

        const startDateString = `${dateString} ${timeString}`;
        const startDate = c.parseDate(startDateString);

        return startDate;
    }

    private async getDateString({
        thElement,
    }: {
        thElement: p.ElementHandle,
    }) {
        const tableElement = await thElement.$('xpath/../../..');

        if (!tableElement) {
            throw new Error(`tableElement is null.`);
        }

        const dateStringElement = await tableElement.$('th[scope="col"].always-left.column-header');

        if (!dateStringElement) {
            throw new Error(`dateStringElement is null.`);
        }

        const dateString = await (await dateStringElement.getProperty('textContent')).jsonValue();

        if (!dateString) {
            throw new Error(`dateString is null.`);
        }

        return dateString;
    }

    private async getTimeString({
        thElement,
    }: {
        thElement: p.ElementHandle,
    }) {
        const timeStringElement = await thElement.$('.event-cell__start-time');

        if (!timeStringElement) {
            throw new Error(`timeStringElement is null.`);
        }

        const timeString = await (await timeStringElement.getProperty('textContent')).jsonValue();

        if (!timeString) {
            throw new Error('timeString is null.');
        }

        return timeString;
    }
}