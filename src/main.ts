import * as database from './database';
import * as globalModels from './global';

const allTeams = globalModels.allTeams;
const allExchanges = globalModels.allExchanges;
const allGames = globalModels.allGames;
const allOutcomes = globalModels.allOutcomes;
const allExchangeGames = globalModels.allExchangeGames;
const allExchangeGameTeams = globalModels.allExchangeGameTeams;
const allOdds = globalModels.allOdds;

async function main() {
    await database.init();

    // initialize primary objects
    await allTeams.init();
    await allExchanges.init();
    await allGames.init();
    await allOutcomes.init();

    // initialize linkage objects
    await allExchangeGames.init();
    await allExchangeGameTeams.init();
    await allOdds.init();

    // update linkage object elements
    await allExchangeGames.updateElements();
    await allExchangeGameTeams.updateElements();
    await allOdds.updateElements();

    // update odd values
    await allOdds.updateValues();

    process.exit(0);
}

main();