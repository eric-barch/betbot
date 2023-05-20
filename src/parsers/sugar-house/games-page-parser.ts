import * as c from 'chrono-node';
import * as p from 'puppeteer';
import * as s from 'sequelize';

import { GamesPageParser } from '../games-page-parser';
import { WebpageConnection } from '../webpage-connection';

import * as db from '../../db';

export class SugarHouseNbaGamesPageParser extends GamesPageParser {
    protected wrappedWebpageConnector: WebpageConnection;

    constructor() {
        super();
        this.wrappedWebpageConnector = new WebpageConnection({
            url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home'
        });
    }

    public async getGames(): Promise<Array<db.models.Game>> {
        return await this.getGamesFromDocument();
    }

    private async getGamesFromDocument(): Promise<Array<db.models.Game>> {
        const games = new Array<db.models.Game>;

        const articleElements = await this.wrappedWebpageConnector.page.$$('article');

        for (const articleElement of articleElements) {
            const gameKey = await this.getGameKey(articleElement);

            const awayTeamId = gameKey.awayTeamId;
            const homeTeamId = gameKey.homeTeamId;
            const startDate = gameKey.startDate;

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

    public async getGameKey(articleElement: p.ElementHandle): Promise<{
        awayTeamId: number,
        homeTeamId: number,
        startDate: Date,
    }> {
        const teamNames = await this.getTeamNames(articleElement);

        const awayTeam = await db.models.Team.findByUnformattedName({ unformattedName: teamNames.awayTeamName });
        const homeTeam = await db.models.Team.findByUnformattedName({ unformattedName: teamNames.homeTeamName });
        
        let startDateString: string | undefined;

        try {
            startDateString = await this.getStartDateString(articleElement);
        } catch { }

        const awayTeamId = awayTeam.id;
        const homeTeamId = homeTeam.id;
        
        let startDate: Date;
        
        if (!startDateString) {
            startDate = new Date();
        } else {
            startDate = c.parseDate(startDateString);
        }

        return {
            awayTeamId,
            homeTeamId,
            startDate,
        };
    }

    public async getTeamNames(articleElement: p.ElementHandle): Promise<{
        awayTeamName: string,
        homeTeamName: string,
    }> {
        const awayTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[1]/div/span');
        const homeTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[2]/div/span');

        if (!awayTeamElement || !homeTeamElement) {
            throw new Error(`teamElement is null.`);
        }

        const awayTeamName = await (await awayTeamElement.getProperty('textContent')).jsonValue();
        const homeTeamName = await (await homeTeamElement.getProperty('textContent')).jsonValue();

        if (!awayTeamName || !homeTeamName) {
            throw new Error(`teamName is null.`)
        }

        return {
            awayTeamName,
            homeTeamName,
        };
    }

    public async getStartDateString(articleElement: p.ElementHandle): Promise<string> {
        const startDateElement = await articleElement.$('time');

        if (!startDateElement) {
            throw new Error(`startDateElement is null.`);
        }

        const startDateString = await (await startDateElement.getProperty('textContent')).jsonValue();

        if (!startDateString) {
            throw new Error( `startDateString is null.`);
        }

        return startDateString;
    }
}