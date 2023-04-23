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

    await allTeams.init();
    await allExchanges.init();
    await allExchangeGames.init();
    await allExchangeGameTeams.init();
    await allOutcomes.init();
    await allOdds.init();

    await allOdds.updateElements();
    await allOdds.updateValues();

    console.log(allGames, allOutcomes, allOdds);
    process.exit(0);
}

main();

// async function updateExchangeGames() {
//     await allExchanges.updateExchangeGames();
//     setTimeout(updateExchangeGames, 30000);
//     setTimeout(updateExchangeGameElements, 1000);
// }