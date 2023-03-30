import * as database from './database';
import * as global from './global';

async function main() {
    const allExchanges = global.allExchanges;
    const allTeams = global.allTeams;

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

// TODO: Global add logic is not working for sets. It adds every iteration, regardless of whether the game is already in the set. Fix for at least Games and Odds. Probably others too.