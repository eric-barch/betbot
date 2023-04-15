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

    while (true) {
        const startTime = new Date();
        await allOdds.updateValues();
        const endTime = new Date();

        const duration = endTime.getTime() - startTime.getTime();

        console.log(`total duration: ${duration}`);
    }

    process.exit(0);
}

main();

// Without web analysis, analyze takes about 10 milliseconds.