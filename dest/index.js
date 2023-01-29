"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("./mysql");
const exchanges_1 = require("./exchanges");
function main({ verbose = false, headless = true, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        /* Establish connection with MySQL and sync TypeScript object model to
         * MySQL relational model. */
        try {
            yield mysql_1.sequelize.authenticate();
            verbose ? console.log('\nConnection has been established successfully.') : null;
        }
        catch (error) {
            verbose ? console.error('\nUnable to connect to the database: ', error) : null;
        }
        yield mysql_1.sequelize.sync({
            alter: true,
            logging: false,
        });
        /* Instantiate and initialize all Exchanges, then insert into Exchange
         * map. */
        let exchanges = new Map();
        for (const [key, value] of exchanges_1.exchangeNamesAndUrls) {
            let exchange = new exchanges_1.Exchange({
                name: key,
                url: value.url,
                parseFunction: value.parseFunction,
            });
            yield exchange.initialize({
                headless: headless,
                verbose: verbose,
            });
            exchanges.set(key, exchange);
        }
        /***************************CODE BELOW*************************************/
        for (const [key, value] of exchanges) {
            let exchange = value;
            let pageReader = yield exchange.getPageReader();
            yield pageReader.connect({ verbose: verbose });
            yield pageReader.scrape({ verbose: verbose });
            pageReader.saveHtml({
                filepath: '/Users/ericbarch/Desktop',
                verbose: verbose,
            });
            // console.log(pageReader.getHtml().getString());
            let pageParser = yield exchange.getPageParser();
            pageParser.setHtml({ html: pageReader.getHtml() });
            // console.log(pageParser.getHtml().getString());
            yield pageParser.parseGames({ verbose: verbose });
        }
        /***************************CODE ABOVE*************************************/
        /* Close connection with MySQL. */
        yield mysql_1.sequelize.close();
        /* Close all exchange objects and their Puppeteer-based utilities. */
        for (const exchange of exchanges.values()) {
            yield exchange.close({ verbose: verbose });
        }
        verbose ? console.log() : null;
    });
}
main({
    headless: true,
    verbose: true,
});
