import { connect, Browser, Page } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class UpdateOddElementsFunctions {
    spreadAway: Function;
    spreadHome: Function;
    moneylineAway: Function;
    moneylineHome: Function;
    totalOver: Function;
    totalUnder: Function;

    constructor({
        spreadAway,
        spreadHome,
        moneylineAway,
        moneylineHome,
        totalOver,
        totalUnder,
    }: {
        spreadAway: Function,
        spreadHome: Function,
        moneylineAway: Function,
        moneylineHome: Function,
        totalOver: Function,
        totalUnder: Function,
    }) {
        this.spreadAway = spreadAway;
        this.spreadHome = spreadHome;
        this.moneylineAway = moneylineAway;
        this.moneylineHome = moneylineHome;
        this.totalOver = totalOver;
        this.totalUnder = totalUnder;
    }
}

export class Exchange {
    // public properties
    public name: string;
    public url: string;

    // private properties
    private wrappedUpdateExchangeGamesFunction: Function;
    private wrappedUpdateExchangeGameElementFunction: Function;
    private wrappedUpdateExchangeGameTeamElementFunction: Function;
    private wrappedUpdateExchangeOutcomesFunction: Function;
    private wrappedUpdateOddElementsFunctions: UpdateOddElementsFunctions;
    
    // public linked objects
    public exchangeGames: localModels.ExchangeGameSet;
    public odds: localModels.OddSet;
    
    // private linked objects
    private wrappedBrowser: Browser | null;
    private wrappedPage: Page | null;

    // private sequelize object
    private wrappedSqlExchange: databaseModels.Exchange | null;

    // private constructor
    private constructor({
        name,
        url,
        updateExchangeGamesFunction,
        updateExchangeGameElementFunction,
        updateExchangeGameTeamElementFunction,
        updateExchangeOutcomesFunction,
        updateOddElementsFunctions,
    }: {
        name: string,
        url: string,
        updateExchangeGamesFunction: Function,
        updateExchangeGameElementFunction: Function,
        updateExchangeGameTeamElementFunction: Function,
        updateExchangeOutcomesFunction: Function,
        updateOddElementsFunctions: UpdateOddElementsFunctions,
    }) {
        this.name = name;
        this.url = url;

        this.wrappedUpdateExchangeGamesFunction = updateExchangeGamesFunction.bind(this);
        this.wrappedUpdateExchangeGameElementFunction = updateExchangeGameElementFunction;
        this.wrappedUpdateExchangeGameTeamElementFunction = updateExchangeGameTeamElementFunction;
        this.wrappedUpdateExchangeOutcomesFunction = updateExchangeOutcomesFunction.bind(this);
        this.wrappedUpdateOddElementsFunctions = updateOddElementsFunctions;
        
        this.exchangeGames = new localModels.ExchangeGameSet;
        this.odds = new localModels.OddSet();

        this.wrappedBrowser = null;
        this.wrappedPage = null;

        this.wrappedSqlExchange = null;
    }

    // public async constructor
    public static async create({
        name,
        url,
        updateExchangeGamesFunction,
        updateExchangeGameElementFunction,
        updateExchangeGameTeamElementFunction,
        updateExchangeOutcomesFunction,
        updateOddElementsFunctions,
    }: {
        name: string,
        url: string,
        updateExchangeGamesFunction: Function,
        updateExchangeGameElementFunction: Function,
        updateExchangeGameTeamElementFunction: Function,
        updateExchangeOutcomesFunction: Function,
        updateOddElementsFunctions: UpdateOddElementsFunctions,
    }): Promise<Exchange> {
        const newExchange = new Exchange({
            name: name,
            url: url,
            updateExchangeGamesFunction: updateExchangeGamesFunction,
            updateExchangeGameElementFunction: updateExchangeGameElementFunction,
            updateExchangeGameTeamElementFunction: updateExchangeGameTeamElementFunction,
            updateExchangeOutcomesFunction: updateExchangeOutcomesFunction,
            updateOddElementsFunctions: updateOddElementsFunctions,
        })

        await newExchange.connectToExistingPage();

        await newExchange.initSqlExchange();

        return newExchange;
    }

    // private sequelize instance constructor
    private async initSqlExchange(): Promise<databaseModels.Exchange> {
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
    public async close(): Promise<void> {
        this.browser.close();
    }

    public async connectToExistingPage(): Promise<Page> {
        this.browser = await connect({ browserURL: 'http://127.0.0.1:9222' });

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
                height: window.outerHeight,
            };
        });

        this.page = targetPage;
        this.page.setViewport(windowSize);

        return this.page;
    }

    public async updateExchangeGames(): Promise<localModels.ExchangeGameSet> {
        const exchangeGames = await this.wrappedUpdateExchangeGamesFunction();
        return exchangeGames;
    }

    public async updateExchangeGameElements(): Promise<localModels.ExchangeGameSet> {
        const exchangeGames = await this.exchangeGames.updateElements();
        return exchangeGames;
    }

    public async updateExchangeGameTeamElements() {
        const exchangeGameTeams = await this.exchangeGames.updateExchangeGameTeamElements();
        return exchangeGameTeams;
    }

    public async updateExchangeOutcomes() {
        const odds = await this.wrappedUpdateExchangeOutcomesFunction();
        return odds;
    }

    public async updateOddElements() {
        const odds = await this.odds.updateElements();
        return odds;
    }

    public async updateOutcomes(): Promise<localModels.OutcomeSet> {
        const outcomeSet = await this.updateOutcomesFunction();
        return outcomeSet;
    }

    // public static methods

    // getters and setters
    get browser(): Browser {
        if (this.wrappedBrowser) {
            return this.wrappedBrowser;
        } else {
            throw new Error(`${this.name} browser is null.`)
        }
    }

    set browser(browser: Browser) {
        this.wrappedBrowser = browser;
    }

    get nameStripped(): string {
        return this.name.replace(/[^a-zA-Z0-9]/g, '');
    }

    get nameCamelCase(): string {
        let alphanumericString = this.nameStripped;
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    get page(): Page {
        if (this.wrappedPage) {
            return this.wrappedPage;
        } else {
            throw new Error(`${this.name} page is null.`);
        }
    }

    set page(page: Page) {
        this.wrappedPage = page;
    }

    get sqlExchange(): databaseModels.Exchange {
        if (this.wrappedSqlExchange) {
            return this.wrappedSqlExchange;
        } else {
            throw new Error(`${this.name} sqlExchange is null.`)
        }
    }

    set sqlExchange(sqlExchange: databaseModels.Exchange) {
        this.wrappedSqlExchange = sqlExchange;
    }

    get updateGamesFunction(): Function {
        return this.wrappedUpdateExchangeGamesFunction;
    }

    get updateExchangeGameTeamsFunction(): Function {
        return this.wrappedUpdateExchangeGameTeamElementFunction;
    }

    get updateOutcomesFunction(): Function {
        return this.wrappedUpdateExchangeOutcomesFunction;
    }

    get updateOddsFunctions(): UpdateOddElementsFunctions {
        return this.wrappedUpdateOddElementsFunctions;
    }
}