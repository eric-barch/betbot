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
    await allGames.init();
    await allOutcomes.init();

    await allExchangeGames.init();
    await allExchangeGameTeams.init();
    await allOdds.init();

    await allExchangeGames.updateElements();
    await allExchangeGameTeams.updateElements();
    await allOdds.updateElements();

    await allOdds.updateValues();
    await allOutcomes.checkForArbs();

    updateSlowElements();
    updateOddElements();
    updateOddValuesAndCheckForArbs();
}

main();

async function updateSlowElements() {
    const start = new Date();
    await allExchangeGames.updateElements();
    await allExchangeGameTeams.updateElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateSlowElements duration: ${duration}`);

    setTimeout(updateSlowElements, 10000);
}

async function updateOddElements() {
    const start = new Date();
    await allOdds.updateElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateOddElements duration: ${duration}`);

    setTimeout(updateOddElements, 500);
}

async function updateOddValuesAndCheckForArbs() {
    const start = new Date();
    await allOdds.updateValues();
    await allOutcomes.checkForArbs();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`Duration: ${duration}`);

    setTimeout(updateOddValuesAndCheckForArbs, 100);
}