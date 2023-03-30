import * as database from './database';
import * as models from './models';

async function main() {
    const allExchanges = models.allExchanges;
    const allTeams = models.allTeams;

    await database.initialize();
    await allExchanges.initialize();
    await allTeams.initialize();

    let shouldContinue = true;

    while (shouldContinue) {
        await allExchanges.analyze();
    }

    await database.close();
    process.exit(0);
}

main();