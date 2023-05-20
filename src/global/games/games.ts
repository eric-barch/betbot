import * as db from '../../db';
import * as parsers from '../../parsers';

export async function init() {
    console.log();

    const exchangeLeaguePages = await db.models.ExchangeLeaguePage.findAll();

    for (const exchangeLeaguePage of exchangeLeaguePages) {
        const gamesPageParser  = await exchangeLeaguePage.getParser();
        
        if (gamesPageParser instanceof parsers.GamesPageParser) {
            await gamesPageParser.getGames();
        }
    }

    // const parsers = new Array<pageParsers.PageParser>;

    // for (const gamePage of gamePages) {
    //     const parser = await gamePage.getParser();
    //     parsers.push(parser);
    // }
}