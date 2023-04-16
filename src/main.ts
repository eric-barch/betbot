import * as database from './database';
import * as globalModels from './global';

const allTeams = globalModels.allTeams;
const allExchanges = globalModels.allExchanges;
const allGames = globalModels.allGames;
const allStatistics = globalModels.allStatistics;
const allOdds = globalModels.allOdds;

async function main() {
    await database.init();

    await allTeams.init();
    await allExchanges.init();
    await allGames.init();
    await allStatistics.init();
    await allOdds.init();

    async function updateElements() {
        const start = new Date();
        await allOdds.updateElements();
        const end = new Date();

        const duration = end.getTime() - start.getTime();
        console.log(`Update elements duration: ${duration}`);

        setTimeout(updateElements, 0);
    }

    async function updateValues() {
        const start = new Date();
        await allOdds.updateValues();
        const end = new Date();

        const duration = end.getTime() - start.getTime();
        console.log(`Update values duration: ${duration}`);

        setTimeout(updateValues, 0);
    }

    updateElements();
    updateValues();
}

main();