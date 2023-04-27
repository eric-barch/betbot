import * as chrono from 'chrono-node';

import { Exchange } from '../exchange';
import * as globalModels from '../../../global';
import * as localModels from '../../../models';

export class SugarHouseExchange extends Exchange {
    public name: string = 'SugarHouse';
    public url: string = 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches';

    protected wrappedExchangeGames: localModels.ExchangeGameSet = new localModels.ExchangeGameSet();
    protected wrappedOdds: localModels.OddSet = new localModels.OddSet();

    public async updateGames(): Promise<localModels.GameSet> {
        const games = new localModels.GameSet;

        const articleElements = await this.page.$$('article');

        for (const articleElement of articleElements) {
            const awayTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[1]/div/span');
            const homeTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[2]/div/span');
            const startDateElement = await articleElement.$('time');
    
            if (!awayTeamElement || !homeTeamElement || !startDateElement) {
                continue;
            }
    
            const awayTeamName = await (await awayTeamElement.getProperty('textContent')).jsonValue();
            const homeTeamName = await (await homeTeamElement.getProperty('textContent')).jsonValue();
            const startDateText = await (await startDateElement.getProperty('textContent')).jsonValue();
    
            if (!awayTeamName || !homeTeamName || !startDateText) {
                continue;
            }
    
            const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
            const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
            let startDate = chrono.parseDate(startDateText);
    
            if (!startDate) {
                startDate = new Date();
            }
    
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

    public async updateExchangeGamesFromJson(): Promise<localModels.ExchangeGameSet | null> {
        /**SugarHouse does not catalog games in JSON format. */
        return null;
    }

    public async updateExchangeGamesFromDocument(): Promise<localModels.ExchangeGameSet | null> {
        const articleElements = await this.page.$$('article');

        for (const articleElement of articleElements) {
            const awayTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[1]/div/span');
            const homeTeamElement = await articleElement.$('xpath/div/div/div/div[1]/div[2]/div/div/div[2]/div/span');
            const startDateElement = await articleElement.$('time');
    
            if (!awayTeamElement || !homeTeamElement || !startDateElement) {
                continue;
            }
    
            const awayTeamName = await (await awayTeamElement.getProperty('textContent')).jsonValue();
            const homeTeamName = await (await homeTeamElement.getProperty('textContent')).jsonValue();
            const startDateText = await (await startDateElement.getProperty('textContent')).jsonValue();
    
            if (!awayTeamName || !homeTeamName || !startDateText) {
                continue;
            }
    
            const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
            const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
            let startDate = chrono.parseDate(startDateText);
    
            if (!startDate) {
                startDate = new Date();
            }
    
            const requestedGame = await globalModels.allGames.findOrCreate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });
    
            if (requestedGame) {
                await this.getExchangeGames().findOrCreate({
                    exchange: this,
                    game: requestedGame,
                });
            }
        }

        /**TODO: At end of method, we should also DELETE games that are no longer found on the
         * website. */
        return this.getExchangeGames();
    }
}