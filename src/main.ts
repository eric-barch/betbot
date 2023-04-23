import * as database from './database';
import * as globalModels from './global';

const allTeams = globalModels.allTeams;
const allExchanges = globalModels.allExchanges;
const allGames = globalModels.allGames;
const allOutcomes = globalModels.allOutcomes;
const allExchangeGames = globalModels.allExchangeGames;
const allExchangeGameTeams = globalModels.allExchangeGameTeams;

async function main() {
    await database.init();

    await allTeams.init();
    await allExchanges.init();
    await allExchangeGames.init();
    await allExchangeGameTeams.init();

    // await allExchangeGames.updateElements();
    // await allExchangeGameTeams.updateElements();

    console.log(allGames, allOutcomes);
    process.exit(0);
}

main();

// async function updateExchangeGames() {
//     await allExchanges.updateExchangeGames();
//     setTimeout(updateExchangeGames, 30000);
//     setTimeout(updateExchangeGameElements, 1000);
// }

// async function updateExchangeGameElements() {
//     await allExchanges.updateExchangeGameElements();
//     setTimeout(updateExchangeGameTeamElements, 1000);
// }

// async function updateExchangeGameTeamElements() {
//     await allExchanges.updateExchangeGameTeamElements();
//     setTimeout(updateExchangeOutcomes, 30000);
// }

// async function updateExchangeOutcomes() {
//     await allExchanges.updateExchangeOutcomes();
//     setTimeout(updateOddElements, 1000);
// }

// async function updateOddElements() {
//     await allExchanges.updateOddElements();
//     setTimeout(updateOddValues, 100);
// }

// async function updateOddValues() {
//     await allOdds.updateValues();
//     // setTimeout(checkForArbitrage, 100);
// }

// async function checkForArbitrage() {
//     await allOdds.checkForArbitrage();
// }