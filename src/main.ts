import * as database from './database';
import * as global from './global';

const allTeams = global.allTeams;
const allExchanges = global.allExchanges;
const allGames = global.allGames;
const allOutcomes = global.allOutcomes;
const allExchangeGames = global.allExchangeGames;
const allExchangeGameTeams = global.allExchangeGameTeams;
const allOdds = global.allOdds;

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

    updateExchangeGameElements();
    updateExchangeGameTeamElements();
    updateOddElements();
    updateOddValues();
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
