import * as chrono from 'chrono-node';

import { Exchange } from '../exchange';
import * as globalModels from '../../../global';
import * as localModels from '../../../models';

export class DraftKingsExchange extends Exchange {
    public name: string = 'DraftKings';
    public url: string = 'https://sportsbook.draftkings.com/leagues/basketball/nba';

    protected wrappedExchangeGames: localModels.ExchangeGameSet = new localModels.ExchangeGameSet();
    protected wrappedOdds: localModels.OddSet = new localModels.OddSet();

    public async getGames(): Promise<Array<localModels.Game>> {
        const gamesFromJson = await this.getGamesFromJson();
        /**TODO: Implement getGamesFromDocument, then filter gamesFromJson by gamesFromDocument. */
        // const games = await this.confirmGamesAgainstDocument();
        return gamesFromJson;
    }

    private async getGamesFromJson(): Promise<Array<localModels.Game>> {
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

    private async parseJsonGames(jsonGames: Array<any>): Promise<Array<localModels.Game>> {
        const games = new Array<localModels.Game>;

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

            games.push(game);
        }

        return games;
    }

    private async confirmGamesAgainstDocument({
        gamesFromJson,
    }: {
        gamesFromJson: Array<localModels.Game>,
    })/*: Promise<Array<localModels.Game>> */{
        // let games = new Array<localModels.Game>;

        // for (const gameFromJson of gamesFromJson) {
        //     const awayTeamIdentifier = gameFromJson.awayTeam.identifierFull.toLowerCase();
        //     const homeTeamIdentifier = gameFromJson.homeTeam.identifierFull.toLowerCase();
        //     const regex = new RegExp(`${awayTeamIdentifier}.*${homeTeamIdentifier}`);

        //     let awayTeamRowElement;

        //     const teamRowElements = await this.page.$$('tbody > tr');

        //     for (const teamRowElement of teamRowElements) {
        //         const gameNameElement = await teamRowElement.$('th > a.event-cell-link');
        
        //         if (!gameNameElement) {
        //             continue;
        //         }
        
        //         const gameName = await (await gameNameElement.getProperty('href')).jsonValue();
        //         const gameNameClean = gameName.trim().toLowerCase();
        
        //         if (!regex.test(gameNameClean)) {
        //             continue;
        //         }

        //         const possibleDateElement = await teamRowElement.$('xpath/../../thead/tr/th[1]/div/span/span/span');
        //         const possibleTimeElement = await teamRowElement.$('xpath/th/a/div/div[1]/span');

        //         if ((!possibleDateElement) || (!possibleTimeElement)) {
        //             continue;
        //         }

        //         const dateText = await (await possibleDateElement.getProperty('textContent')).jsonValue();
        //         const timeText = await (await possibleTimeElement.getProperty('textContent')).jsonValue();

        //         if ((!dateText) || (!timeText)) {
        //             continue;
        //         }

        //         const startDateText = `${dateText} ${timeText}`;
        //         const startDate = chrono.parseDate(startDateText);
        //         const startDateRounded = localModels.Game.roundDateToNearestInterval(startDate);

        //         if (startDateRounded === gameFromJson.startDate) {
        //             awayTeamRowElement = teamRowElement;
        //             break;
        //         }
        //     }
    
        //     if (!awayTeamRowElement) {
        //         continue;
        //     }

        // }
    }
}