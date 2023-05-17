import * as c from 'chrono-node';
import * as p from 'puppeteer';
import * as s from 'sequelize';

import * as db from '../../db';
import * as pageParsers from '../../pageParsers';

interface GameTeams {
    awayTeam: db.Team;
    homeTeam: db.Team;
}

export class DraftKingsNbaGamesPageParser extends pageParsers.GamesPageParser {
    protected wrappedWebpageConnector: pageParsers.WebpageConnector;

    constructor() {
        super();
        this.wrappedWebpageConnector = new pageParsers.WebpageConnector({
            url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
        })
    }

    public async getGames(): Promise<Array<db.Game>> {
        await this.initGamesFromJson();
        return await this.getGamesFromDocument();
    }

    private async initGamesFromJson(): Promise<Array<db.Game>> {
        const jsonGames = await this.scrapeJsonGames();
        return await this.parseJsonGames(jsonGames);
    }

    private async scrapeJsonGames(): Promise<Array<any>> {
        const gameScriptElements = await this.wrappedWebpageConnector.page.$$('script[type="application/ld+json"]');

        if (gameScriptElements.length < 1) {
            throw new Error(`Did not find jsonGameScriptElements for DraftKings.`);
        }

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

    private async parseJsonGames(jsonGames: Array<any>): Promise<Array<db.Game>> {
        const games = new Array<db.Game>;

        for (const jsonGame of jsonGames) {

            const awayTeamId = (await this.getAwayTeamFromJsonGame(jsonGame)).id;
            const homeTeamId = (await this.getHomeTeamFromJsonGame(jsonGame)).id;
            const startDate = new Date(jsonGame.startDate);

            const game = await db.Game.findByTeamIdsAndStartDate({
                awayTeamId,
                homeTeamId,
                startDate,
            });

            games.push(game);
        }

        return games;
    }

    private async getAwayTeamFromJsonGame(jsonGame: any): Promise<db.Team> {
        const awayTeamName = jsonGame.awayTeam.name;
        const awayTeam = await db.Team.findByString({ unformattedString: awayTeamName });
        return awayTeam;
    }

    private async getHomeTeamFromJsonGame(jsonGame: any): Promise<db.Team> {
        const homeTeamName = jsonGame.homeTeam.name;
        const homeTeam = await db.Team.findByString({ unformattedString: homeTeamName });
        return homeTeam;
    }

    private async getGamesFromDocument(): Promise<Array<db.Game>> {
        const games = new Array<db.Game>;

        const rowElements = await this.wrappedWebpageConnector.page.$$('div[class*="parlay-card"] table > tbody > tr');

        for (const rowElement of rowElements) {
            try {
                var rowElementTeam = await this.getRowElementTeam(rowElement);
            } catch {
                continue;
            }
            
            try {
                var rowElementGameTeams = await this.getRowElementGameTeams(rowElement);
            } catch {
                continue;
            }

            const awayTeamId = rowElementGameTeams.awayTeam.id;
            const homeTeamId = rowElementGameTeams.homeTeam.id;

            if (!awayTeamId || !homeTeamId) {
                continue;
            }

            try {
                var startDate = await this.getStartDate({
                    rowElement,
                    rowElementTeam,
                    rowElementGameTeams,
                });
            } catch {
                continue;
            }

            const game = await db.Game.findByTeamIdsAndStartDate({
                awayTeamId,
                homeTeamId,
                startDate,
            })

            games.push(game);
        }

        return games;
    }

    private async getRowElementTeam(rowElement: p.ElementHandle): Promise<db.Team> {
        const teamNameElement = await rowElement.$('xpath/th/a/div/div[2]/div/span/div/div');

        if (!teamNameElement) {
            throw new Error(`teamNameElement is null.`);
        }

        const teamName = await (await teamNameElement.getProperty('textContent')).jsonValue();

        if (!teamName) {
            throw new Error(`teamName is null.`);
        }

        const team = db.Team.findByString({ unformattedString: teamName });

        return team;
    }

    private async getRowElementGameTeams(rowElement: p.ElementHandle): Promise<GameTeams> {
        const aElement = await rowElement.$('xpath/th/a');

        if (!aElement) {
            throw new Error(`aElement is null.`);
        }

        const hrefString = await (await aElement.getProperty('href')).jsonValue();

        if (typeof hrefString !== 'string') {
            throw new Error(`hrefString is not string.`);
        }

        const gameTeams = this.getGameTeamsFromString(hrefString);

        return gameTeams;
    }

    private async getGameTeamsFromString(string: string): Promise<GameTeams> {
        let teamA: db.Team | undefined;
        let teamAIndex: number | undefined;

        let teamB: db.Team | undefined;
        let teamBIndex: number | undefined;

        string = string.toLowerCase().replace('sportsbook.draftkings.com', '');

        const allTeams = await db.Team.findAll({
            where: {
                leagueId: 1,
            }
        });

        for (const team of allTeams) {
            const index = string.indexOf(team.nameFull.toLowerCase());
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
            throw new Error(`Something is null that shouldn't be.`);
        }

        let awayTeam: db.Team;
        let homeTeam: db.Team;

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
        rowElement,
        rowElementTeam,
        rowElementGameTeams,
    }: {
        rowElement: p.ElementHandle,
        rowElementTeam: db.Team,
        rowElementGameTeams: GameTeams,
    }): Promise<Date> {
        const dateString = await this.getDateString({
            rowElement,
        });

        const timeString = await this.getTimeString({
            rowElementGameTeams,
            rowElementTeam,
            rowElement,
        });

        const startDateString = `${dateString} ${timeString}`;
        const startDate = c.parseDate(startDateString);
        return startDate;
    }

    private async getDateString({
        rowElement,
    }: {
        rowElement: p.ElementHandle,
    }): Promise<string> {            
        const dateStringElement = await rowElement.$('xpath/../../thead/tr/th[1]/div/span');
        
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
        rowElementGameTeams,
        rowElementTeam,
        rowElement,
    }: {
        rowElementGameTeams: GameTeams;
        rowElementTeam: db.Team,
        rowElement: p.ElementHandle,
    }): Promise<string> {
        const awayTeam = rowElementGameTeams.awayTeam;
        const homeTeam = rowElementGameTeams.homeTeam;

        let timeElement;

        if (rowElementTeam === awayTeam) {
            timeElement = await rowElement.$('xpath/th/a/div/div[1]/span');
        }

        if (rowElementTeam === homeTeam) {
            const previousRowElement = await rowElement.getProperty('previousSibling');

            if (!(previousRowElement instanceof p.ElementHandle)) {
                throw new Error(`previousRowElement is null.`);
            }

            timeElement = await previousRowElement.$('xpath/th/a/div/div[1]/span');
        }

        if (!timeElement) {
            throw new Error(`timeElement is null.`);
        }

        const timeString = await (await timeElement.getProperty('textContent')).jsonValue();

        if (!timeString) {
            throw new Error(`timeString is null.`);
        }

        return timeString;
    }
}