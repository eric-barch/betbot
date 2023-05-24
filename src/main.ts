import * as db from './db';
import * as global from './global';

async function main() {
  await db.sequelizeInstance.init();

  await global.allExchanges.init();
  await global.allLeagues.init();
  await global.allTeams.init();
  await global.allPageTypes.init();

  await global.allExchangeLeagues.init();
  await global.allExchangeLeaguePageTypes.init();

  await global.allGames.init();

  await db.sequelizeInstance.close();
}

main();
