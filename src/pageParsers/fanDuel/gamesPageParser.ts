import * as c from 'chrono-node';
import * as p from 'puppeteer';
import * as s from 'sequelize';

import { WebpageConnector } from '../../pageParsers';
import * as db from '../../db';
import * as pageParsers from '../../pageParsers';

export class FanDuelNbaGamesPageParser extends pageParsers.GamesPageParser {
    protected wrappedWebpageConnector: pageParsers.WebpageConnector;
    
    constructor() {
        super();
        this.wrappedWebpageConnector = new WebpageConnector({
            url: 'https://sportsbook.fanduel.com/navigation/nba',
        })
    }

    public async getGames(): Promise<Array<db.models.Game>> {
        await this.initGamesFromJson();
        return await this.getGamesFromDocument();
    }

    private async initGamesFromJson(): Promise<Array<db.models.Game>> {
        const jsonGames = await this.scrapeJsonGames();
        const games = await this.parseJsonGames(jsonGames);
        return games;
    }

    private async scrapeJsonGames(): Promise<Array<any>> {
        const gamesScriptElement = await this.wrappedWebpageConnector.page.$('script[type="application/ld+json"][data-react-helmet="true"]');

        if (!gamesScriptElement) {
            throw new Error(`Did not find jsonGamesScriptElement for FanDuel.`);
        }
    
        const textContent = await (await gamesScriptElement.getProperty('textContent')).jsonValue();
    
        if (!textContent) {
            throw new Error(`Found no text in FanDuel jsonGamesScriptElement.`);
        }

        const jsonGames = JSON.parse(textContent);
        return jsonGames;
    }

    private async parseJsonGames(jsonGames: Array<any>): Promise<Array<db.models.Game>> {
        const games = new Array<db.models.Game>;

        for (const jsonGame of jsonGames) {
            const awayTeamName = jsonGame.awayTeam.name;
            const homeTeamName = jsonGame.homeTeam.name;

            const awayTeam = await db.models.Team.findByString({ unformattedString: awayTeamName });
            const homeTeam = await db.models.Team.findByString({ unformattedString: homeTeamName });
            const startDate = new Date(jsonGame.startDate);

            const [game, created] = await db.models.Game.findOrCreate({
                where: {
                    [s.Op.and]: [
                        { awayTeamId: awayTeam.id },
                        { homeTeamId: homeTeam.id },
                        db.sequelizeInstanceWrapper.instance.where(
                            db.sequelizeInstanceWrapper.instance.fn('YEAR', db.sequelizeInstanceWrapper.instance.col('startDate')),
                            startDate.getUTCFullYear()
                        ),
                        db.sequelizeInstanceWrapper.instance.where(
                            db.sequelizeInstanceWrapper.instance.fn('MONTH', db.sequelizeInstanceWrapper.instance.col('startDate')),
                            startDate.getUTCMonth() + 1,
                        ),
                        db.sequelizeInstanceWrapper.instance.where(
                            db.sequelizeInstanceWrapper.instance.fn('DAY', db.sequelizeInstanceWrapper.instance.col('startDate')),
                            startDate.getUTCDate(),
                        ),
                    ],
                },
                defaults: {
                    awayTeamId: awayTeam.id,
                    homeTeamId: homeTeam.id,
                    startDate: startDate,
                },
            });

            if (game) {
                games.push(game);
            }
        }

        return games;
    }

    private async getGamesFromDocument(): Promise<Array<db.models.Game>> {
        const games = new Array<db.models.Game>;

        const gameLinkElements = await this.getGameLinkElements();

        for (const gameLinkElement of gameLinkElements) {
            const gameTeams = await this.getGameTeams(gameLinkElement);

            const awayTeamId = gameTeams.awayTeam.id;
            const homeTeamId = gameTeams.homeTeam.id;
            
            let startDate: Date;
            
            try {
                startDate = await this.getStartDate(gameLinkElement);
            } catch {
                startDate = new Date();
            }

            const [game, created] = await db.models.Game.findOrCreate({
                where: {
                    [s.Op.and]: [
                        { awayTeamId },
                        { homeTeamId },
                        db.sequelizeInstanceWrapper.instance.where(
                            db.sequelizeInstanceWrapper.instance.fn('YEAR', db.sequelizeInstanceWrapper.instance.col('startDate')),
                            startDate.getUTCFullYear()
                        ),
                        db.sequelizeInstanceWrapper.instance.where(
                            db.sequelizeInstanceWrapper.instance.fn('MONTH', db.sequelizeInstanceWrapper.instance.col('startDate')),
                            startDate.getUTCMonth() + 1,
                        ),
                        db.sequelizeInstanceWrapper.instance.where(
                            db.sequelizeInstanceWrapper.instance.fn('DAY', db.sequelizeInstanceWrapper.instance.col('startDate')),
                            startDate.getUTCDate(),
                        ),
                    ],
                },
                defaults: {
                    awayTeamId,
                    homeTeamId,
                    startDate,
                },
            });

            if (game) {
                games.push(game);
            }
        }

        return games;
    }

    private async getGameLinkElements(): Promise<Array<p.ElementHandle<HTMLAnchorElement>>> {
        const teams = await db.models.Team.findAll();
        const teamNames = teams.map(team => team.nameFull);
        const teamNamesJoined = teamNames.join(`|`);
        const regex = new RegExp(`(${teamNamesJoined}).*@.*(${teamNamesJoined})`, `i`);

        const linkElements = await this.wrappedWebpageConnector.page.$$('a');

        let firstGameLinkElement;

        for (const linkElement of linkElements) {
            const title = await (await linkElement.getProperty('title')).jsonValue();

            if (regex.test(title)) {
                firstGameLinkElement = linkElement;
                break;
            }
        }

        if (!firstGameLinkElement) {
            throw new Error(`Did not find first game link element.`);
        }

        const gameLinkClassName = await (await firstGameLinkElement.getProperty('className')).jsonValue();
        const gameLinkElements = await this.wrappedWebpageConnector.page.$$(`a[class='${gameLinkClassName}']`);

        return gameLinkElements;
    }

    private async getGameTeams(gameLinkElement: p.ElementHandle<HTMLAnchorElement>): Promise<{
        awayTeam: db.models.Team,
        homeTeam: db.models.Team,
    }> {
        const title = await (await gameLinkElement.getProperty('title')).jsonValue();

        const teams = await db.models.Team.findAll();
        const teamNames = teams.map(team => team.nameFull.toLowerCase());
        const teamNamesJoined = teamNames.join(`|`);

        const regex = new RegExp(`(${teamNamesJoined})`, `ig`);

        const allMatches = new Array<string>;

        for (const match of title.matchAll(regex)) {
            allMatches.push(match[0]);
        }

        if (allMatches.length !== 2) {
            throw new Error(`Got wrong number of matches.`);
        }

        const awayTeamNameFull = allMatches[0];
        const homeTeamNameFull = allMatches[1];

        const awayTeam = await db.models.Team.findByString({ unformattedString: awayTeamNameFull });
        const homeTeam = await db.models.Team.findByString({ unformattedString: homeTeamNameFull });

        return {
            awayTeam: awayTeam,
            homeTeam: homeTeam,
        }
    }

    private async getStartDate(gameLinkElement: p.ElementHandle<HTMLAnchorElement>): Promise<Date> {
        const parentElement = await gameLinkElement.$('xpath/../../../..');

        if (!parentElement) {
            throw new Error(`parentElement is null.`);
        }

        const startDateElements = await parentElement.$$('time');
        
        if (startDateElements.length !== 1) {
            throw new Error(`startDateElements.length is not equal to 1.`);
        }

        const startDateStringDirty = await (await startDateElements[0].getProperty('textContent')).jsonValue();

        if (!startDateStringDirty) {
            throw new Error(`startDateStringDirty is null.`);
        }

        const regex = /(AM|PM).*$/i;
        const startDateStringClean = startDateStringDirty.replace(regex, '$1');

        const startDate = c.parseDate(startDateStringClean);
        return startDate;
    }
}