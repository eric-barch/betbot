import * as database from './database';
import * as globalModels from './global';

const allExchanges = globalModels.allExchanges;

async function main() {
    await database.init();
    await globalModels.init();

    while (true) {
        const startTime = new Date();
        await allExchanges.analyze();
        const endTime = new Date();

        const duration = endTime.getTime() - startTime.getTime();

        console.log(duration);
    }

    process.exit(0);
}

main();

// Without web analysis, analyze takes about 10 milliseconds.