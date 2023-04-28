import * as chrono from 'chrono-node';
import { Page, ElementHandle } from 'puppeteer';

import { Exchange } from '../exchange';
import * as globalModels from '../../../global';
import * as localModels from '../../../models';

export class DraftKingsExchange extends Exchange {
    public name: string = 'DraftKings';
    public url: string = 'https://sportsbook.draftkings.com/leagues/basketball/nba';

    protected wrappedExchangeGames: localModels.ExchangeGameSet = new localModels.ExchangeGameSet();
    protected wrappedOdds: localModels.OddSet = new localModels.OddSet();

    public async connectToPage(): Promise<Page> {
        const page = await super.connectToPage();
        await page.reload();
        return page;
    }

    public async updateGames(): Promise<localModels.GameSet> {
        const gamesFromJson = await this.updateGamesFromJson();
        const gamesFromDocument = await this.updateGamesFromDocument();

        const games = new localModels.GameSet;

        for (const gameFromJson of gamesFromJson) {
            games.add(gameFromJson);
        }

        for (const gameFromDocument of gamesFromDocument) {
            games.add(gameFromDocument);
        }

        // delete if not still there? or should that be handled by exchangeGame?

        return games;
    }

    private async updateGamesFromJson(): Promise<localModels.GameSet> {
        const jsonGames = await this.scrapeJsonGames();
        const games = await this.parseJsonGames(jsonGames);
        return games;
    }

    private async scrapeJsonGames(): Promise<Array<any>> {
        const gameScriptElements = await this.page.$$('script[type="application/ld+json"]');

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

    private async parseJsonGames(jsonGames: Array<any>): Promise<localModels.GameSet> {
        const games = new localModels.GameSet;

        for (const jsonGame of jsonGames) {
            const awayTeamName = jsonGame.awayTeam.name;
            const homeTeamName = jsonGame.homeTeam.name;

            const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
            const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
            const startDate = new Date(jsonGame.startDate);

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

    private async updateGamesFromDocument(): Promise<localModels.GameSet> {
        const games = new localModels.GameSet;

        const trElements = await this.page.$$('div[class*="parlay-card"] table > tbody > tr');

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

            const game = await globalModels.allGames.findOrCreate({
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

    private async getTrElementTeam(trElement: ElementHandle): Promise<localModels.Team | null> {
        const teamNameElement = await trElement.$('xpath/th/a/div/div[2]/div/span/div/div');

        if (!teamNameElement) {
            return null;
        }

        const teamName = await (await teamNameElement.getProperty('textContent')).jsonValue();

        if (!teamName) {
            return null;
        }

        const team = globalModels.allTeams.find({ name: teamName });
        return team;
    }

    private async getTrElementGameTeams(trElement: ElementHandle): Promise<{
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
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
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
    } | null {
        let teamA: localModels.Team | undefined;
        let teamAIndex: number | undefined;

        let teamB: localModels.Team | undefined;
        let teamBIndex: number | undefined;

        string = string.toLowerCase().replace('sportsbook.draftkings.com', '');

        for (const team of globalModels.allTeams) {
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

        let awayTeam: localModels.Team;
        let homeTeam: localModels.Team;

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
        trElementTeam: localModels.Team,
        trElementGameTeams: {
            awayTeam: localModels.Team,
            homeTeam: localModels.Team,
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
        const startDate = chrono.parseDate(startDateString);
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
            awayTeam: localModels.Team,
            homeTeam: localModels.Team,
        },
        trElementTeam: localModels.Team,
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