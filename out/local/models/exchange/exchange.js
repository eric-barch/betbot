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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exchange = void 0;
const puppeteer = __importStar(require("puppeteer"));
const databaseModels = __importStar(require("../../../database"));
const globalModels = __importStar(require("../../../global"));
const localModels = __importStar(require("../../../local"));
class Exchange {
    // private constructor
    constructor({ name, url, }) {
        this.name = name;
        this.url = url;
        this.wrappedUpdateGamesFunction = undefined;
        this.wrappedUpdateStatisticsFunction = undefined;
        this.gameSet = new localModels.GameSet();
        this.statisticSet = new localModels.StatisticSet();
        this.oddSet = new localModels.OddSet();
        this.wrappedBrowser = null;
        this.wrappedPage = null;
        this.wrappedSqlExchange = null;
    }
    // public async constructor
    static async create({ name, url, }) {
        const newExchange = new Exchange({
            name: name,
            url: url,
        });
        await newExchange.connectToExistingPage();
        await newExchange.initSqlExchange();
        return newExchange;
    }
    // private sequelize instance constructor
    async initSqlExchange() {
        await databaseModels.Exchange.findOrCreate({
            where: {
                name: this.name,
            },
            defaults: {
                name: this.name,
                url: this.url,
            },
        }).then(async ([sqlExchange, created]) => {
            if (!created) {
                await sqlExchange.update({
                    url: this.url,
                });
            }
            this.sqlExchange = sqlExchange;
        });
        return this.sqlExchange;
    }
    // public instance methods
    async close() {
        this.browser.close();
    }
    async connectToExistingPage() {
        this.browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
        const targets = this.browser.targets();
        const target = targets.find(target => target.url().includes(this.url));
        if (!target) {
            throw new Error('Expected Target.');
        }
        const targetPage = await target.page();
        if (!targetPage) {
            throw new Error('Expected page.');
        }
        const windowSize = await targetPage.evaluate(() => {
            return {
                width: window.outerWidth,
                height: window.outerHeight - 75 // This seems to be roughly the height of the Chrome navigation bar. Find a less hacky way to do this.
            };
        });
        this.page = targetPage;
        this.page.setViewport(windowSize);
        return this.page;
    }
    async updateGames() {
        await this.updateGamesFunction();
        return this.gameSet;
    }
    async updateStatistics() {
        await this.updateStatisticsFunction();
        return this.statisticSet;
    }
    async updateOdds() {
        for (const statistic of this.statisticSet) {
            const updateOddFunction = globalModels.updateOddFunctions.get(`${this.nameCamelCase}_${statistic.name}`);
            if (!updateOddFunction) {
                throw new Error(`Did not find corresponding update odd function.`);
            }
            await updateOddFunction({
                exchange: this,
                statistic: statistic,
            });
        }
    }
    // public static methods
    // getters and setters
    get browser() {
        if (this.wrappedBrowser) {
            return this.wrappedBrowser;
        }
        else {
            throw new Error(`${this.name} browser is null.`);
        }
    }
    set browser(browser) {
        this.wrappedBrowser = browser;
    }
    get nameStripped() {
        return this.name.replace(/[^a-zA-Z0-9]/g, '');
    }
    get nameCamelCase() {
        let alphanumericString = this.nameStripped;
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }
    get page() {
        if (this.wrappedPage) {
            return this.wrappedPage;
        }
        else {
            throw new Error(`${this.name} page is null.`);
        }
    }
    set page(page) {
        this.wrappedPage = page;
    }
    get sqlExchange() {
        if (this.wrappedSqlExchange) {
            return this.wrappedSqlExchange;
        }
        else {
            throw new Error(`${this.name} sqlExchange is null.`);
        }
    }
    set sqlExchange(sqlExchange) {
        this.wrappedSqlExchange = sqlExchange;
    }
    get updateGamesFunction() {
        if (!this.wrappedUpdateGamesFunction) {
            throw new Error(`wrappedUpdateGamesFunction is undefined.`);
        }
        return this.wrappedUpdateGamesFunction;
    }
    set updateGamesFunction(updateGamesFunction) {
        if (!updateGamesFunction) {
            throw new Error(`updateGamesFunction is undefined.`);
        }
        this.wrappedUpdateGamesFunction = updateGamesFunction.bind(this);
    }
    get updateStatisticsFunction() {
        if (!this.wrappedUpdateStatisticsFunction) {
            throw new Error(`wrappedUpdateStatisticsFunction is undefined.`);
        }
        return this.wrappedUpdateStatisticsFunction;
    }
    set updateStatisticsFunction(updateStatisticsFunction) {
        if (!updateStatisticsFunction) {
            throw new Error(`updateStatisticsFunction is undefined.`);
        }
        this.wrappedUpdateStatisticsFunction = updateStatisticsFunction.bind(this);
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map