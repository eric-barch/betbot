import * as database from './database';
import * as globalModels from './global';

const allExchanges = globalModels.allExchanges;

async function main() {
    await database.init();
    await globalModels.init();

    while (true) {
        await allExchanges.analyze();
    }

    await database.close();
    process.exit(0);
}

main();