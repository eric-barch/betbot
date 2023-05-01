import * as chrono from 'chrono-node';

import { ElementHandle } from 'puppeteer';

import { ConnectionManager } from '../connectionManager';
import { Exchange } from '../exchange';
import * as global from '../../../../../global';
import * as models from '../../../..';

export class FanDuelExchange extends Exchange {
    protected wrappedName: string = 'FanDuel';
    protected wrappedUrl: string = 'https://sportsbook.fanduel.com/navigation/nba';
    protected wrappedConnectionManager: ConnectionManager;

    constructor() {
        super();
        this.wrappedName = 'FanDuel';
        this.wrappedUrl = 'https://sportsbook.fanduel.com/navigation/nba';
        this.wrappedConnectionManager = new ConnectionManager({ exchange: this });
    }

    public async getGames(): Promise<models.GameSet> {
        const gamesFromJson = await this.getGamesFromJson();
        const gamesFromDocument = await this.getGamesFromDocument();

        const games = new models.GameSet;

        for (const gameFromJson of gamesFromJson) {
            games.add(gameFromJson);
        }

        for (const gameFromDocument of gamesFromDocument) {
            games.add(gameFromDocument);
        }

        return games;
    }

    private async getGamesFromJson(): Promise<models.GameSet> {
        const jsonGames = await this.scrapeJsonGames();
        const games = await this.parseJsonGames(jsonGames);
        return games;
    }

    private async scrapeJsonGames(): Promise<Array<any>> {
        const gamesScriptElement = await this.connectionManager.page.$('script[type="application/ld+json"][data-react-helmet="true"]');

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

        const gameLinkElements = await this.getGameLinkElements();

        for (const gameLinkElement of gameLinkElements) {
            const gameTeams = await this.getGameTeams(gameLinkElement);

            if (!gameTeams) {
                continue;
            }

            const startDate = await this.getStartDate(gameLinkElement);

            const game = await global.allGames.findOrCreate({
                awayTeam: gameTeams.awayTeam,
                homeTeam: gameTeams.homeTeam,
                startDate: startDate,
            });

            if (game) {
                games.add(game);
            }
        }

        return games;
    }

    private async getGameLinkElements() {
        const teamArray = Array.from(global.allTeams);
        const teamIdentifiers = teamArray.map(team => team.identifierFull.toLowerCase());
        const teamIdentifiersJoined = teamIdentifiers.join(`|`);

        const matchPattern = new RegExp(`(${teamIdentifiersJoined}).*@.*(${teamIdentifiersJoined})`, `i`);

        const linkElements = await this.connectionManager.page.$$('a');
        
        let firstGameLinkElement;

        for (const linkElement of linkElements) {
            const title = await (await linkElement.getProperty('title')).jsonValue();

            if (matchPattern.test(title)) {
                firstGameLinkElement = linkElement;
                break;
            }
        }

        if (!firstGameLinkElement) {
            throw new Error(`Did not find first game link element.`);
        }

        const gameLinkClassName = await (await firstGameLinkElement.getProperty('className')).jsonValue();
        const gameLinkElements = await this.connectionManager.page.$$(`a[class='${gameLinkClassName}']`);
        return gameLinkElements;
    }

    private async getGameTeams(gameLinkElement: ElementHandle<HTMLAnchorElement>): Promise<{
        awayTeam: models.Team,
        homeTeam: models.Team,
    } | null> {
        const title = await (await gameLinkElement.getProperty('title')).jsonValue();

        const teamArray = Array.from(global.allTeams);
        const teamIdentifiers = teamArray.map(team => team.identifierFull.toLowerCase());
        const teamIdentifiersJoined = teamIdentifiers.join(`|`);

        const matchPattern = new RegExp(`(${teamIdentifiersJoined})`, `ig`);

        const allMatches = new Array<string>;

        for (const match of title.matchAll(matchPattern)) {
            allMatches.push(match[0]);
        }

        if (allMatches.length !== 2) {
            throw new Error(`Got wrong number of matches.`);
        } 

        const awayTeamIdentifier = allMatches[0];
        const homeTeamIdentifier = allMatches[1];

        const awayTeam = global.allTeams.find({ name: awayTeamIdentifier });
        const homeTeam = global.allTeams.find({ name: homeTeamIdentifier });

        return {
            awayTeam: awayTeam,
            homeTeam: homeTeam,
        }
    }

    private async getStartDate(gameLinkElement: ElementHandle<HTMLAnchorElement>): Promise<Date | undefined> {
        const parentElement = await gameLinkElement.$('xpath/../../../..');

        if (!parentElement) {
            return undefined;
        }

        const startDateElements = await parentElement.$$('time');
        
        if (startDateElements.length !== 1) {
            return undefined;
        }

        const startDateStringDirty = await (await startDateElements[0].getProperty('textContent')).jsonValue();

        if (!startDateStringDirty) {
            return undefined;
        }

        const regex = /(AM|PM).*$/i;
        const startDateStringClean = startDateStringDirty.replace(regex, '$1');

        const startDate = chrono.parseDate(startDateStringClean);
        return startDate;
    }
}