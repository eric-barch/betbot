import * as database from './database';
import * as state from './state';

(async () => {
    await database.initialize();

    const allExchanges = state.allExchanges;
    await allExchanges.initialize();

    for (let i = 0; i < 1; i++) {
        allExchanges.analyze();
    }

    // await database.close();
    // await allExchanges.close();
})();

/** TODO: If possible, remove all '!'s and '?'s re: typing. 
 * Probably should remove page parser altogether. Parsing should occur right on the main exchange page.
 */