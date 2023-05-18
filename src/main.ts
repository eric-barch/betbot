import * as db from './db/_index';
import * as global from './global/_index';

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