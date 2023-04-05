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
const puppeteer_1 = require("puppeteer");
const databaseModels = __importStar(require("../../../database/models"));
const globalModels = __importStar(require("../../../global/models"));
const localModels = __importStar(require("../../../local/models"));
class Exchange {
    constructor({ name, url, }) {
        this.name = name;
        this.url = url;
        this.gameSet = new localModels.GameSet();
        this.oddSet = new localModels.OddSet();
        this.wrappedBrowser = null;
        this.wrappedPage = null;
        this.wrappedSqlExchange = null;
    }
    // async construction methods
    static async create({ name, url, }) {
        const newExchange = new Exchange({
            name: name,
            url: url,
        });
        await newExchange.init();
        globalModels.allExchanges.add(newExchange);
        return newExchange;
    }
    async init() {
        await this.connectToExistingPage();
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
            this.wrappedSqlExchange = sqlExchange;
        });
        return this;
    }
    // instance methods
    async analyze() {
        await this.updateGameSet();
        await this.updateOddSet();
        await this.oddSet.updateValues();
    }
    async close() {
        this.browser.close();
    }
    async connectToExistingPage() {
        this.browser = await (0, puppeteer_1.connect)({ browserURL: 'http://127.0.0.1:9222' });
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
    }
    async updateGameSet() {
        // Rewrite this in a more readable way.
        const jsonGamesScriptTag = await this.page.$('script[type="application/ld+json"][data-react-helmet="true"]');
        const jsonGames = await this.page.evaluate(element => JSON.parse(element.textContent), jsonGamesScriptTag);
        //
        for (const jsonGame of jsonGames) {
            const awayTeamNameString = jsonGame.awayTeam.name;
            const homeTeamNameString = jsonGame.homeTeam.name;
            const awayTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: awayTeamNameString });
            const homeTeamInstance = globalModels.allTeams.getTeamByNameString({ nameString: homeTeamNameString });
            const startDate = new Date(jsonGame.startDate);
            await globalModels.allGames.getGameByTeamsAndStartDate({
                awayTeam: awayTeamInstance,
                homeTeam: homeTeamInstance,
                startDate: startDate,
                exchange: this,
            });
        }
        return this.gameSet;
    }
    async updateOddSet() {
        for (const game of this.gameSet) {
            await game.getOddByExchange({
                exchange: this,
                game: game,
            });
            //the below should not be necessary here. this = exchange
            //this.oddSet.add(odd);
        }
        return this.oddSet;
    }
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
}
exports.Exchange = Exchange;
//# sourceMappingURL=exchange.js.map