import * as chrono from 'chrono-node';
import { ElementHandle } from 'puppeteer';

import { Exchange } from '../exchange';
import * as globalModels from '../../../../../global';
import * as localModels from '../../../..';
import { ConnectionManager } from '../connectionManager';

export class SugarHouseExchange extends Exchange {
    public name: string;
    public url: string;
    protected wrappedConnectionManager: ConnectionManager;

    constructor() {
        super();
        this.name = 'SugarHouse';
        this.url = 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home';
        this.wrappedConnectionManager = new ConnectionManager({ exchange: this });
    }

    public async getGames(): Promise<localModels.GameSet> {
        const games = new localModels.GameSet;

        const articleElements = await this.connectionManager.page.$$('article');

        for (const articleElement of articleElements) {
            const gameSearchObjects = await this.getGameSearchObjects(articleElement);

            const awayTeam = gameSearchObjects.awayTeam;
            const homeTeam = gameSearchObjects.homeTeam;
            const startDate = gameSearchObjects.startDate;
    
            const game = await globalModels.allGames.findOrCreate({
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

    public async getGameSearchObjects(articleElement: ElementHandle): Promise<{
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }> {
        const gameIdentifyingStrings = await this.getGameIdentifyingStrings(articleElement);

        const awayTeamName = gameIdentifyingStrings.awayTeamName;
        const homeTeamName = gameIdentifyingStrings.homeTeamName;
        const startDateString = gameIdentifyingStrings.startDateString;

        if (!awayTeamName) {
            throw new Error(`awayTeamName is null.`);
        }

        if (!homeTeamName) {
            throw new Error(`homeTeamName is null.`);
        }

        const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
        const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
        let startDate: Date;

        if (!startDateString) {
            startDate = new Date();
        } else {
            startDate = chrono.parseDate(startDateString);
        }

        return {
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        }
    }

    public async getGameIdentifyingStrings(articleElement: ElementHandle): Promise<{
        awayTeamName: string | null,
        homeTeamName: string | null,
        startDateString: string | null,
    }> {
        const gameIdentifyingElements = await this.getGameIdentifyingElements(articleElement);

        const awayTeamElement = gameIdentifyingElements.awayTeamElement;
        const homeTeamElement = gameIdentifyingElements.homeTeamElement;
        const startDateElement = gameIdentifyingElements.startDateElement;

        let awayTeamName: string | null = null;
        let homeTeamName: string | null = null;
        let startDateString: string | null = null;

        if (awayTeamElement) {
            awayTeamName = await (await awayTeamElement.getProperty('textContent')).jsonValue();
        }

        if (homeTeamElement) {
            homeTeamName = await (await homeTeamElement.getProperty('textContent')).jsonValue();
        }

        if (startDateElement) {
            startDateString = await (await startDateElement.getProperty('textContent')).jsonValue();
        }

        return {
            awayTeamName: awayTeamName,
            homeTeamName: homeTeamName,
            startDateString: startDateString,
        }
    }

    public async getGameIdentifyingElements(articleElement: ElementHandle): Promise<{
        awayTeamElement: ElementHandle | null,
        homeTeamElement: ElementHandle | null,
        startDateElement: ElementHandle | null,
    }> {
        /**TODO: there's got to be a better way to do this without xpaths. */
        const awayTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[1]/div/span');
        const homeTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[2]/div/span');
        const startDateElement = await articleElement.$('time');

        return {
            awayTeamElement: awayTeamElement,
            homeTeamElement: homeTeamElement,
            startDateElement: startDateElement,
        };
    }
}