import * as database from './database';
import * as globalModels from './global';

const allTeams = globalModels.allTeams;
const allExchanges = globalModels.allExchanges;
const allGames = globalModels.allGames;
const allOutcomes = globalModels.allOutcomes;
const allExchangeGames = globalModels.allExchangeGames;
const allExchangeGameTeams = globalModels.allExchangeGameTeams;
const allOdds = globalModels.allOdds;
const allArbs = globalModels.allArbs;

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
    await allOutcomes.checkForNewArbs();

    updateExchangeGameElements();
    updateExchangeGameTeamElements();
    updateOddElements();
    updateOddValues();
    checkForNewArbs();
    updateExistingArbs();
}

main();

async function updateExchangeGameElements() {
    const start = new Date();
    await allExchangeGames.updateElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateExchangeGameElements duration: ${duration}`);

    setTimeout(updateExchangeGameElements, 10000);
}

async function updateExchangeGameTeamElements() {
    const start = new Date();
    await allExchangeGameTeams.updateElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateExchangeGameTeamElements duration: ${duration}`);

    setTimeout(updateExchangeGameTeamElements, 10000);
}

async function updateOddElements() {
    const start = new Date();
    await allOdds.updateElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateOddElements duration: ${duration}`);

    setTimeout(updateOddElements, 500);
}

async function updateOddValues() {
    const start = new Date();
    await allOdds.updateValues();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateOddValues duration: ${duration}`);

    setTimeout(updateOddValues, 100);
}

async function checkForNewArbs() {
    const start = new Date();
    await allOutcomes.checkForNewArbs();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`checkForNewArbs duration: ${duration});

    setTimeout(checkForNewArbs, 100);
}

async function updateExistingArbs() {
    const start = new Date();
    await allArbs.update();
    const end = new Date();

    const duration = end.getTime() - start.getTime();

    // console.log(`updateExistingArbs duration: ${duration}`);

    setTimeout(updateExistingArbs, 100);
}
