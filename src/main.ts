import * as database from './database';
import * as state from './state/global';

async function main() {
    await database.initiate();
    
    await state.allExchanges.initiate();

    // /** Web scraping. */
    // for (let exchange of state.exchanges) {
        
    //     let pageReader = await exchange.getPageReader();
    //     verbose ? console.log() : null;
    //     await pageReader.connect({verbose: verbosity.pageReader.init});
    //     verbose ? console.log() : null;
    //     await pageReader.scrape({verbose: verbosity.pageReader.scrape});

    //     let pageParser = await exchange.getPageParser();
    //     verbose ? console.log() : null;
    //     await pageParser.setPageContent({
    //         html: pageReader.getHtml(),
    //         verbose: verbosity.pageParser.init,
    //     });
    //     verbose ? console.log() : null;
    //     await pageParser.parse({verbose: verbosity.pageParser.parse});
    
    // }

    /** Close connection with MySQL. */
    await database.close();

    /** Close all exchange objects and their Puppeteer-based utilities. */
    // for (const exchange of state.exchanges) {
    //     verbosity.exchangeObject.close ? console.log() : null;
    //     await exchange.close({verbose: verbosity.exchangeObject.close});
    // }
}

main();

/** TODO: If possible, remove all '!'s and '?'s re: typing. 
 * Fix verbosity tags so that it matches granularity of object structure.
*/