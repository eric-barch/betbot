import * as database from './database';
import * as state from './state';

(async () => {
    await database.initialize();
    const allExchanges = state.allExchanges;

    allExchanges.initialize();

    for (let i = 0; i < 1; i++) {
        allExchanges.analyze();
    }

    await database.close();
    await allExchanges.close();
})();

/** TODO: If possible, remove all '!'s and '?'s re: typing. 
 * Fix verbosity tags so that it matches granularity of object structure.
*/