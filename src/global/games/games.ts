import * as db from '../../db';

export async function init() {
    console.log();

    const exchangeLeaguePages = await db.ExchangeLeaguePage.findAll();

    for (const exchangeLeaguePage of exchangeLeaguePages) {
        const gamesPageParser = await exchangeLeaguePage.getGamesPageParser();
        await gamesPageParser.getGames();
        console.log();
    }

    // const parsers = new Array<pageParsers.PageParser>;

    // for (const gamePage of gamePages) {
    //     const parser = await gamePage.getParser();
    //     parsers.push(parser);
    // }
}