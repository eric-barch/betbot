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
exports.Exchange = exports.exchangeNamesAndUrls = void 0;
const exchange_page_utilities_1 = require("./exchange-page-utilities");
const mysql_1 = require("./mysql");
exports.exchangeNamesAndUrls = new Map([
    ['FanDuel', 'https://sportsbook.fanduel.com/navigation/nfl'],
    ['DraftKings', 'https://sportsbook.draftkings.com/leagues/football/nfl'],
]);
class Exchange {
    // Constructor
    constructor({ name, url, }) {
        this.name = name;
        this.nameCamelCase = this.setNameCamelCase();
        this.url = url;
        this.pageReader = new exchange_page_utilities_1.ExchangePageReader({ exchange: this });
        this.pageParser = new exchange_page_utilities_1.ExchangePageParser({ exchange: this });
        this.pageWriter = new exchange_page_utilities_1.ExchangePageWriter({ exchange: this });
        this.currentOdds = new Map;
        this.lastSavedOdds = new Map;
        this.sequelizeModel = mysql_1.MySqlExchange.create({
            name: this.getName(),
            url: this.getUrl()
        });
    }
    // Public methods
    initialize({ headless = true, verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`\nInitializing Exchange object for ${this.getName()}.`) : null;
            yield this.pageReader.initialize({ headless: headless, verbose: verbose });
            yield this.pageParser.initialize({ headless: headless, verbose: verbose });
            yield this.pageWriter.initialize({ headless: headless, verbose: verbose });
            verbose ? console.log(`Exchange object for ${this.getName()} initialized succesfully.`) : null;
        });
    }
    close({ verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`\nClosing Exchange object for ${this.getName()}.`) : null;
            yield this.pageReader.close({ verbose: verbose });
            yield this.pageParser.close({ verbose: verbose });
            yield this.pageWriter.close({ verbose: verbose });
            verbose ? console.log(`Exchange object for ${this.getName()} closed succesfully.`) : null;
        });
    }
    // Getters
    getName({ verbose = false, } = {}) {
        return this.name;
    }
    getNameCamelCase({ verbose = false, }) {
        return this.nameCamelCase;
    }
    getUrl({ verbose = false, } = {}) {
        return this.url;
    }
    getPageReader({ verbose = false, }) {
        return this.pageReader;
    }
    getPageParser({ verbose = false, }) {
        return this.pageParser;
    }
    getPageWriter({ verbose = false, }) {
        return this.pageWriter;
    }
    getCurrentOdds({ verbose = false, }) {
        return this.currentOdds;
    }
    getLastSavedOdds({ verbose = false, }) {
        return this.lastSavedOdds;
    }
    // Private methods
    // Setters
    setName({ name, verbose = false, }) {
        this.name = name;
    }
    setNameCamelCase({ string, verbose = false, } = {}) {
        let str;
        if (string == undefined) {
            str = this.name;
        }
        else {
            str = string;
        }
        let alphanumericString = str.replace(/[^a-zA-Z0-9]/g, '');
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }
    setUrl({ url, verbose = false, }) {
        this.url = url;
    }
    setPageReader({ pageReader, verbose = false, }) {
        this.pageReader = pageReader;
    }
    setPageParser({ pageParser, verbose = false, }) {
        this.pageParser = pageParser;
    }
    setPageWriter({ pageWriter, verbose = false, }) {
        this.pageWriter = pageWriter;
    }
    setCurrentOdds({ currentOdds, verbose = false, }) {
        this.currentOdds = currentOdds;
    }
    setLastSavedOdds({ lastSavedOdds, verbose = false, }) {
        this.lastSavedOdds = lastSavedOdds;
    }
}
exports.Exchange = Exchange;
