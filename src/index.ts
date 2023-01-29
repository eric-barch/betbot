import { sequelize } from "./mysql";
import { exchangeNamesAndUrls, Exchange, } from "./exchanges";
import { Game } from "./games";
import { teams } from "./teams";

async function main({
    verbose = false,
    headless = true,
}: {
    verbose?: boolean,
    headless?: boolean,
} = {}) {

    /* Establish connection with MySQL and sync TypeScript object model to 
     * MySQL relational model. */
    try {
        await sequelize.authenticate();
        verbose ? console.log('\nConnection has been established successfully.') : null;
    }catch (error) {
        verbose ? console.error('\nUnable to connect to the database: ', error) : null;
    }

    await sequelize.sync({
        alter: true,
        logging: false,
    });
    
    /* Instantiate and initialize all Exchanges, then insert into Exchange 
     * map. */
    let exchanges = new Map<string, Exchange>();

    for (const [key, value] of exchangeNamesAndUrls) {
        let exchange = new Exchange({
            name: key, 
            url: value.url,
            parseFunction: value.parseFunction,
        });
        await exchange.initialize({
            headless: headless, 
            verbose: verbose,
        });
        exchanges.set(key, exchange);
    }

    /***************************CODE BELOW*************************************/

    for (const [key, value] of exchanges) {
        
        let exchange = value;
        
        let pageReader = await exchange.getPageReader();
        await pageReader.connect({verbose: verbose});
        await pageReader.scrape({verbose: verbose});
        pageReader.saveHtml({
            filepath: '/Users/ericbarch/Desktop',
            verbose: verbose,
        });
        // console.log(pageReader.getHtml().getString());

        let pageParser = await exchange.getPageParser();
        pageParser.setHtml({html: pageReader.getHtml()});
        // console.log(pageParser.getHtml().getString());
        await pageParser.parseGames({verbose: verbose});
    
    }

    /***************************CODE ABOVE*************************************/

    /* Close connection with MySQL. */
    await sequelize.close();

    /* Close all exchange objects and their Puppeteer-based utilities. */
    for (const exchange of exchanges.values()) {
        await exchange.close({verbose: verbose});
    }

    verbose ? console.log() : null;

}

main({
    headless: true,
    verbose: true,
});