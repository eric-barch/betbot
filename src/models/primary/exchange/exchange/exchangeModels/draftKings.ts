import { parseDate } from 'chrono-node';
import { ElementHandle } from 'puppeteer';

import { Exchange } from '../exchange';
import * as global from '../../../../../global';
import * as models from '../../../../../models';

export class DraftKingsExchange extends Exchange {
    constructor() {
        super({
            name: 'DraftKings',
            url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
        });
    }

    /**base exchange class init method is overwritten because DK seems to need refreshing 
     * immediately after initial connection to ensure correct labeling in DOM */
    public async init(): Promise<Exchange> {
        await super.connectionManager.connect();
        // await this.connectionManager.page.reload();
        await this.initSqlExchange();
        return this;
    }

    public async getGames(): Promise<models.GameSet> {
        return await this.getGamesFromDocument();
    }

    private async getGamesFromJson(): Promise<models.GameSet> {
        const jsonGames = await this.scrapeJsonGames();
        const games = await this.parseJsonGames(jsonGames);
        return games;
    }

    private async scrapeJsonGames(): Promise<Array<any>> {
        const gameScriptElements = await this.connectionManager.page.$$('script[type="application/ld+json"]');

        const jsonGames = new Array;

        for (const gameScriptElement of gameScriptElements) {
            const textContent = await (await gameScriptElement.getProperty('textContent')).jsonValue();
            
            if (textContent) {
                const jsonGame = JSON.parse(textContent);
                jsonGames.push(jsonGame);
            }
        }

        return jsonGames;
    }

    private async parseJsonGames(jsonGames: Array<any>): Promise<models.GameSet> {
        const games = new models.GameSet;

        for (const jsonGame of jsonGames) {
            const awayTeamName = jsonGame.awayTeam.name;
            const homeTeamName = jsonGame.homeTeam.name;

            const awayTeam = global.allTeams.find({ name: awayTeamName });
            const homeTeam = global.allTeams.find({ name: homeTeamName });
            const startDate = new Date(jsonGame.startDate);

            const game = await global.allGames.findOrCreate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });

            if (game) {
                games.add(game);
            }
        }

        return games;
    }

    private async getGamesFromDocument(): Promise<models.GameSet> {
        const games = new models.GameSet;

        const trElements = await this.connectionManager.page.$$('div[class*="parlay-card"] table > tbody > tr');

        for (const trElement of trElements) {
            const trElementTeam = await this.getTrElementTeam(trElement);

            if (!trElementTeam) {
                continue;
            }

            const trElementGameTeams = await this.getTrElementGameTeams(trElement);

            if (!trElementGameTeams) {
                continue;
            }

            const startDate = await this.getStartDate({
                trElement: trElement,
                trElementTeam: trElementTeam,
                trElementGameTeams: trElementGameTeams,
            });

            const game = await global.allGames.findOrCreate({
                awayTeam: trElementGameTeams.awayTeam,
                homeTeam: trElementGameTeams.homeTeam,
                startDate: startDate,
            });

            if (game) {
                games.add(game);
            }
        }

        return games;
    }

    private async getTrElementTeam(trElement: ElementHandle): Promise<models.Team | null> {
        const teamNameElement = await trElement.$('xpath/th/a/div/div[2]/div/span/div/div');

        if (!teamNameElement) {
            return null;
        }

        const teamName = await (await teamNameElement.getProperty('textContent')).jsonValue();

        if (!teamName) {
            return null;
        }

        const team = global.allTeams.find({ name: teamName });
        return team;
    }

    private async getTrElementGameTeams(trElement: ElementHandle): Promise<{
        awayTeam: models.Team,
        homeTeam: models.Team,
    } | null> {
        const aElement = await trElement.$('xpath/th/a');

        if (!aElement) {
            return null;
        }

        const hrefString = await (await aElement.getProperty('href')).jsonValue();

        if (typeof hrefString !== 'string') {
            return null;
        }

        const gameTeams = this.getGameTeamsFromString(hrefString);

        return gameTeams;
    }

    private getGameTeamsFromString(string: string): {
        awayTeam: models.Team,
        homeTeam: models.Team,
    } | null {
        let teamA: models.Team | undefined;
        let teamAIndex: number | undefined;

        let teamB: models.Team | undefined;
        let teamBIndex: number | undefined;

        string = string.toLowerCase().replace('sportsbook.draftkings.com', '');

        for (const team of global.allTeams) {
            const index = string.indexOf(team.identifierFull.toLowerCase());
            if (index === -1) {
                continue;
            }

            if (!teamA) {
                teamA = team;
                teamAIndex = index;
            } else {
                teamB = team;
                teamBIndex = index;
            }
        }

        if (!teamA || !teamB || !teamAIndex || !teamBIndex) {
            return null;
        }

        let awayTeam: models.Team;
        let homeTeam: models.Team;

        if (teamAIndex < teamBIndex) {
            awayTeam = teamA;
            homeTeam = teamB;
        } else {
            awayTeam = teamB;
            homeTeam = teamA;
        }

        return {
            awayTeam: awayTeam,
            homeTeam: homeTeam,
        }
    }

    private async getStartDate({
        trElement,
        trElementTeam,
        trElementGameTeams,
    }: {
        trElement: ElementHandle,
        trElementTeam: models.Team,
        trElementGameTeams: {
            awayTeam: models.Team,
            homeTeam: models.Team,
        }
    }): Promise<Date | undefined> {
        const dateString = await this.getDateString({
            trElement: trElement,
        });

        const timeString = await this.getTimeString({
            trElementGameTeams: trElementGameTeams,
            trElementTeam: trElementTeam,
            trElement: trElement,
        });

        if (!dateString || !timeString) {
            return undefined;
        }

        const startDateString = `${dateString} ${timeString}`;
        const startDate = parseDate(startDateString);
        return startDate;
    }

    private async getDateString({
        trElement,
    }: {
        trElement: ElementHandle,
    }): Promise<string | null> {            
        const dateStringElement = await trElement.$('xpath/../../thead/tr/th[1]/div/span');
        
        if (!dateStringElement) {
            return null;
        }

        const dateString = await (await dateStringElement.getProperty('textContent')).jsonValue();
        return dateString;
    }

    private async getTimeString({
        trElementGameTeams,
        trElementTeam,
        trElement,
    }: {
        trElementGameTeams: {
            awayTeam: models.Team,
            homeTeam: models.Team,
        },
        trElementTeam: models.Team,
        trElement: ElementHandle,
    }): Promise<string | null> {
        const awayTeam = trElementGameTeams.awayTeam;
        const homeTeam = trElementGameTeams.homeTeam;

        let timeElement;

        if (trElementTeam === awayTeam) {
            timeElement = await trElement.$('xpath/th/a/div/div[1]/span');
        }

        if (trElementTeam === homeTeam) {
            const previousTrElement = await trElement.getProperty('previousSibling');

            if (!(previousTrElement instanceof ElementHandle)) {
                return null;
            }

            timeElement = await previousTrElement.$('xpath/th/a/div/div[1]/span');
        }

        if (!timeElement) {
            return null;
        }

        const timeString = await (await timeElement.getProperty('textContent')).jsonValue();
        return timeString;
    }
}