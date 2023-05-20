import * as db from './db';
import * as global from './global';

async function main() {
    await db.sequelizeInstanceWrapper.init();

    await global.AllExchanges.init();
    await global.AllLeagues.init();
    await global.AllTeams.init();
    await global.AllPageTypes.init();

    await global.AllExchangeLeagues.init();
    await global.AllExchangeLeaguePages.init();
    
    await global.AllGames.init();
}

main();