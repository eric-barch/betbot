import * as db from '../../db';
import * as parsers from '../../parsers';

class AllGames {
    private active: Array<db.models.Game>;

    constructor() {
        this.active = new Array<db.models.Game>;
    }

    public async init() {
        console.log();
    
        const exchangeLeaguePageTypes = await db.models.ExchangeLeaguePageType.findAll();
    
        for (const exchangeLeaguePageType of exchangeLeaguePageTypes) {
            const gamesPageParser  = await exchangeLeaguePageType.getParser();
            
            if (gamesPageParser instanceof parsers.GamesPageParser) {
                await gamesPageParser.getGames();
            }
        }
    }
}

export const allGames = new AllGames();