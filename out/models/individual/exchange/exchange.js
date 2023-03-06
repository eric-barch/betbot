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
const database = __importStar(require("../../../database"));
const models = __importStar(require("../../../models"));
const state = __importStar(require("../../../state"));
class Exchange {
    constructor({ name, url, parseFunction, }) {
        this.name = name;
        this.url = url;
        this.pageReader = new models.ExchangePageReader({ exchange: this });
        this.pageParser = new models.ExchangePageParser({
            exchange: this,
            parseFunction: parseFunction,
        });
        this.pageWriter = new models.ExchangePageWriter({ exchange: this });
        this.games = [];
        this.odds = {
            current: [],
            lastSaved: [],
        };
        this.sequelizeModel = undefined;
    }
    analyze() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pageReader.scrape();
            yield this.pageReader.saveHtml({ filepath: '/Users/ericbarch/Documents/Development/AutomaticSportsBetting/iteration-6/html' });
            yield this.pageParser.setPageContent({ html: this.pageReader.getHtml() });
            console.log(`AllGames length: ${state.allGames.getLength()}`);
            console.log(`AllOdds length: ${state.allOdds.getLength()}`);
            const currentExchangeGames = yield this.pageParser.parse();
            console.log(`AllGames length: ${state.allGames.getLength()}`);
            console.log(`AllOdds length: ${state.allOdds.getLength()}`);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pageReader.close();
            yield this.pageParser.close();
            yield this.pageWriter.close();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pageReader.initializeNewPageAndConnect();
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pageReader.connectToExistingPage();
            yield this.pageParser.initialize();
            // await this.pageWriter.initialize();
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
                    console.log("Exchange created: ", exchange.get({ plain: true }));
                }
                else {
                    console.log("Exchange already exists:", exchange.get({ plain: true }));
                    const rowData = exchange.get({ plain: true });
                    if (rowData.url !== this.getUrl()) {
                        database.SqlExchange.update({ url: this.getUrl() }, { where: {
                                name: this.getName(),
                            } }).then((updatedRows) => {
                            console.log(`Database URL updated to match program URL.`);
                        });
                    }
                    else {
                        console.log(`Database URL matches program URL. No update necessary.`);
                    }
                }
            });
        });
    }
    // Getters
    getName() {
        return this.name;
    }
    getNameStripped() {
        return this.getName().replace(/[^a-zA-Z0-9]/g, '');
    }
    getNameCamelCase() {
        let alphanumericString = this.getNameStripped();
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }
    getUrl() {
        return this.url;
    }
    getPageReader() {
        return this.pageReader;
    }
    getPageParser() {
        return this.pageParser;
    }
    getPageWriter() {
        return this.pageWriter;
    }
    getOdds() {
        return this.odds;
    }
    getCurrentOdds() {
        return this.odds.current;
    }
    getLastSavedOdds() {
        return this.odds.lastSaved;
    }
    // Private methods
    // Setters
    setName({ name, }) {
        this.name = name;
    }
    setNameCamelCase({ string, } = {}) {
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
    setUrl({ url, }) {
        this.url = url;
    }
    setPageReader({ pageReader, }) {
        this.pageReader = pageReader;
    }
    setPageParser({ pageParser, }) {
        this.pageParser = pageParser;
    }
    setPageWriter({ pageWriter, }) {
        this.pageWriter = pageWriter;
    }
    setGames({ games, }) {
        if (Array.isArray(games)) {
            for (let game of games) {
                this.games.push(game);
            }
        }
        else {
            this.games.push(games);
        }
    }
    setOdds({ odds, }) {
        this.odds = odds;
    }
    setCurrentOdds({ currentOdds, }) {
        this.odds.current = currentOdds;
    }
    setLastSavedOdds({ lastSavedOdds, }) {
        this.odds.lastSaved = lastSavedOdds;
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map