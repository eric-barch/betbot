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
        const updateElementsStart = new Date();
        await allOdds.updateElements();
        const updateElementsEnd = new Date();

        const updateElementsDuration = updateElementsEnd.getTime() - updateElementsStart.getTime();
        console.log(`Update elements duration: ${updateElementsDuration}`);

        const updateValuesStart = new Date();
        await allOdds.updateValues();
        const updateValuesEnd = new Date();

        const updateValuesDuration = updateValuesEnd.getTime() - updateValuesStart.getTime();
        console.log(`Update values duration: ${updateValuesDuration}`);

        const totalDuration = updateValuesEnd.getTime() - updateElementsStart.getTime();
        console.log(`Update total duration: ${totalDuration}`);
    }
    
    

    process.exit(0);
}

main();