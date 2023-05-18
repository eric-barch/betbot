import * as db from './db';
import * as global from './global';

async function main() {
    await db.sequelizeInstanceWrapper.init();

    await global.exchanges.init();
    await global.leagues.init();
    await global.teams.init();
    await global.pageTypes.init();

    await global.exchangeLeagues.init();
    await global.exchangeLeaguePages.init();
    
    await global.games.init();
}

main();