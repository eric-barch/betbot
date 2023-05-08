import * as db from './db';
import * as global from './global';

async function main() {
    await db.init();

    await global.exchanges.init();
    await global.leagues.init();
    await global.exchangeLeagues.init();
    await global.exchangeLeaguePages.init();

    await global.teams.init();

    // console.log(global.exchanges.draftKings);
    // console.log(global.exchanges.fanDuel);
    // console.log(global.exchanges.sugarHouse);

    // console.log(global.leagues.mlb);
    // console.log(global.leagues.nba);
    // console.log(global.leagues.nfl);

    await db.close();
}

main();