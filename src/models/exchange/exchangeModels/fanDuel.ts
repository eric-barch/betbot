import { Exchange } from '../exchange';
import * as globalModels from '../../../global';
import * as localModels from '../../../models';

export class FanDuelExchange extends Exchange {
    public name: string = 'FanDuel';
    public url: string = 'https://sportsbook.fanduel.com/navigation/nba';

    protected wrappedExchangeGames: localModels.ExchangeGameSet = new localModels.ExchangeGameSet();
    protected wrappedOdds: localModels.OddSet = new localModels.OddSet();

    public async getGames(): Promise<Array<localModels.Game>> {
        const gamesFromJson = await this.getGamesFromJson();
        /**TODO: Implement getGamesFromDocument, then filter gamesFromJson by gamesFromDocument. */
        const gamesFromDocumetn = await this.getGamesFromDocument();
        return gamesFromJson;
    }

    private async getGamesFromJson(): Promise<Array<localModels.Game>> {
        const jsonGames = await this.scrapeJsonGames();
        const games = await this.parseJsonGames(jsonGames);
        return games;
    }

    private async scrapeJsonGames(): Promise<Array<any>> {
        const gamesScriptElement = await this.page.$('script[type="application/ld+json"][data-react-helmet="true"]');

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

    private async getGamesFromDocument(): Promise<Array<localModels.Game> | null> {
        return null;
    }

    public async updateExchangeGamesFromJson(): Promise<localModels.ExchangeGameSet | null> {
        const gamesScriptElement = await this.page.$('script[type="application/ld+json"][data-react-helmet="true"]');

        if (!gamesScriptElement) {
            throw new Error(`Did not find jsonGamesScriptElement for FanDuel.`);
        }
    
        const textContent = await (await gamesScriptElement.getProperty('textContent')).jsonValue();
    
        if (!textContent) {
            throw new Error(`Found no text in FanDuel jsonGamesScriptElement.`);
        }

        const jsonGames = JSON.parse(textContent);

        for (const jsonGame of jsonGames) {
            const awayTeamName = jsonGame.awayTeam.name;
            const homeTeamName = jsonGame.homeTeam.name;

            const awayTeam = globalModels.allTeams.find({ name: awayTeamName });
            const homeTeam = globalModels.allTeams.find({ name: homeTeamName });
            const startDate = new Date(jsonGame.startDate);

            const requestedGame = await globalModels.allGames.findOrCreate({
                awayTeam: awayTeam,
                homeTeam: homeTeam,
                startDate: startDate,
            });

            await this.getExchangeGames().findOrCreate({
                exchange: this,
                game: requestedGame,
            })
        }

        /**TODO: At end of method, we should also DELETE games that are no longer found on the
         * website. */
        return this.getExchangeGames();
    }

    public async updateExchangeGamesFromDocument(): Promise<localModels.ExchangeGameSet | null> {
        /**TODO: Implement. */
        return null;
    }
}