"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Exchange = void 0;
const state = __importStar(require("../../.."));
const database = __importStar(require("../../../../database"));
class Exchange {
    constructor({ name, url, parseFunction, verbose = false, }) {
        this.name = name;
        this.url = url;
        this.pageReader = new state.ExchangePageReader({ exchange: this });
        this.pageParser = new state.ExchangePageParser({
            exchange: this,
            parseFunction: parseFunction,
        });
        this.pageWriter = new state.ExchangePageWriter({ exchange: this });
        this.games = [];
        this.odds = {
            current: [],
            lastSaved: [],
        };
        this.sequelizeModel = undefined;
    }
    // Public methods
    initialize({ headless = true, verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`Initializing ${this.getName()} Exchange object.`) : null;
            yield this.pageReader.initialize({ headless: headless, verbose: verbose });
            yield this.pageParser.initialize({ headless: headless, verbose: verbose });
            yield this.pageWriter.initialize({ headless: headless, verbose: verbose });
            this.sequelizeModel = yield database.SqlExchange.findOrCreate({
                where: {
                    name: this.getName(),
                },
                defaults: {
                    name: this.getName(),
                    url: this.getUrl(),
                },
            }).then(([exchange, created]) => {
                if (created) {
                    verbose ? console.log("Exchange created: ", exchange.get({ plain: true })) : null;
                }
                else {
                    verbose ? console.log("Exchange already exists:", exchange.get({ plain: true })) : null;
                    const rowData = exchange.get({ plain: true });
                    if (rowData.url !== this.getUrl()) {
                        database.SqlExchange.update({ url: this.getUrl() }, { where: {
                                name: this.getName(),
                            } }).then((updatedRows) => {
                            verbose ? console.log(`Database URL updated to match program URL.`) : null;
                        });
                    }
                    else {
                        verbose ? console.log(`Database URL matches program URL. No update necessary.`) : null;
                    }
                }
            });
            verbose ? console.log(`${this.getName()} Exchange object initialized succesfully.`) : null;
        });
    }
    close({ verbose = false, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            verbose ? console.log(`Closing ${this.getName()} Exchange object.`) : null;
            yield this.pageReader.close({ verbose: verbose });
            yield this.pageParser.close({ verbose: verbose });
            yield this.pageWriter.close({ verbose: verbose });
            verbose ? console.log(`${this.getName()} Exchange object closed succesfully.`) : null;
        });
    }
    // Getters
    getName({ verbose = false, } = {}) {
        return this.name;
    }
    getNameStripped({ verbose = false, } = {}) {
        return this.getName().replace(/[^a-zA-Z0-9]/g, '');
    }
    getNameCamelCase({ verbose = false, } = {}) {
        let alphanumericString = this.getNameStripped();
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }
    getUrl({ verbose = false, } = {}) {
        return this.url;
    }
    getPageReader({ verbose = false, } = {}) {
        return this.pageReader;
    }
    getPageParser({ verbose = false, } = {}) {
        return this.pageParser;
    }
    getPageWriter({ verbose = false, } = {}) {
        return this.pageWriter;
    }
    getOdds({ verbose = false, } = {}) {
        return this.odds;
    }
    getCurrentOdds({ verbose = false, } = {}) {
        return this.odds.current;
    }
    getLastSavedOdds({ verbose = false, } = {}) {
        return this.odds.lastSaved;
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
    setGames({ games, verbose = false, }) {
        if (Array.isArray(games)) {
            for (let game of games) {
                this.games.push(game);
            }
        }
        else {
            this.games.push(games);
        }
    }
    setOdds({ odds, verbose = false, }) {
        this.odds = odds;
    }
    setCurrentOdds({ currentOdds, verbose = false, }) {
        this.odds.current = currentOdds;
    }
    setLastSavedOdds({ lastSavedOdds, verbose = false, }) {
        this.odds.lastSaved = lastSavedOdds;
    }
}
exports.Exchange = Exchange;
