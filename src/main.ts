import * as database from './database';
import * as globalModels from './global';

const allTeams = globalModels.allTeams;
const allExchanges = globalModels.allExchanges;
const allGames = globalModels.allGames;
const allOutcomes = globalModels.allOutcomes;
const allOdds = globalModels.allOdds;

async function main() {
    await database.init();

    await allTeams.init();
    await allExchanges.init();

    updateExchangeGames();
    updateExchangeGameElements();
    updateExchangeGameTeamElements();
    updateExchangeOutcomes();
    updateOddElements();
    updateOddValues();
}

main();

async function updateExchangeGames() {
    const start = new Date();
    await allExchanges.updateExchangeGames();
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    console.log(`Update exchange games duration: ${duration}`);

    setTimeout(updateExchangeGames, 30000);
}

async function updateExchangeGameElements() {
    const start = new Date();
    await allExchanges.updateExchangeGameElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    console.log(`Update exchange game elements duration: ${duration}`);

    setTimeout(updateExchangeGameElements, 1000);
}

async function updateExchangeGameTeamElements() {
    const start = new Date();
    await allExchanges.updateExchangeGameTeamElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    console.log(`Update exchange game team elements duration: ${duration}`);

    setTimeout(updateExchangeGameTeamElements, 1000);
}

async function updateExchangeOutcomes() {
    const start = new Date();
    await allExchanges.updateExchangeOutcomes();
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    console.log(`Update exchange outcomes duration: ${duration}`);

    setTimeout(updateExchangeOutcomes, 30000);
}

async function updateOddElements() {
    const start = new Date();
    await allExchanges.updateOddElements();
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    console.log(`Update odd elements duration: ${duration}`);

    setTimeout(updateOddElements, 1000);
}

async function updateOddValues() {
    const start = new Date();
    await allOdds.updateValues();
    const end = new Date();

    const duration = end.getTime() - start.getTime();
    console.log(`Update odd values duration: ${duration}`);

    setTimeout(updateOddValues, 100);
}