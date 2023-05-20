import * as db from '../../db';
import * as parsers from '../../parsers';

export class AllGames {
    public static async init() {
        console.log();
    
        const exchangeLeaguePages = await db.models.ExchangeLeaguePage.findAll();
    
        for (const exchangeLeaguePage of exchangeLeaguePages) {
            const gamesPageParser  = await exchangeLeaguePage.getParser();
            
            if (gamesPageParser instanceof parsers.GamesPageParser) {
                await gamesPageParser.getGames();
            }
        }
    }
}