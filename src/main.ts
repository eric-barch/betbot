import * as database from './database';
import * as models from './models';

const allExchanges = models.allExchanges;

(async () => {
    await database.initialize();
    await allExchanges.initialize();

    for (let i = 0; i < 1; i++) {
        allExchanges.analyze();
    }

    await database.close();
    await allExchanges.close();
})();

/** TODO: If possible, remove all '!'s and '?'s re: typing. 
 * Probably should remove page parser altogether. Parsing should occur right on the main exchange page.
 * Make sure that any time a startDate is being set, it is set to the closest 15 minute increment.
 */