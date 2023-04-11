import * as puppeteer from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

const allGames = globalModels.allGames;

export class Exchange {
    // public properties
    public name: string;
    public url: string;
    public updateFunctionsMap: Map<string, Function>;

    // private properties
    private updateGamesFunction: Function;
    
    // public linked objects
    public gameSet: localModels.GameSet;
    public oddSet: localModels.OddSet;
    
    // private linked objects
    private wrappedBrowser: puppeteer.Browser | null;
    private wrappedPage: puppeteer.Page | null;

    // private sequelize object
    private wrappedSqlExchange: databaseModels.Exchange | null;

    // private constructor
    private constructor({
        name,
        url,
        updateFunctionsMap,
    }: {
        name: string,
        url: string,
        updateFunctionsMap: Map<string, Function>,
    }) {
        this.name = name;
        this.url = url;

        this.updateFunctionsMap = updateFunctionsMap;
        
        const updateGamesFunction = updateFunctionsMap.get('games');
        if (updateGamesFunction) {
            this.updateGamesFunction = updateGamesFunction.bind(this);
        } else {
            throw new Error(`Could not find updateGamesFunction for ${name}`);
        }
        
        this.gameSet = new localModels.GameSet();
        this.oddSet = new localModels.OddSet();

        this.wrappedBrowser = null;
        this.wrappedPage = null;

        this.wrappedSqlExchange = null;
    }

    // public async constructor
    public static async create({
        name,
        url,
        updateFunctions: updateFunctionsMap,
    }: {
        name: string,
        url: string,
        updateFunctions: Map<string, Function>,
    }): Promise<Exchange> {
        const newExchange = new Exchange({
            name: name,
            url: url,
            updateFunctionsMap: updateFunctionsMap,
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
    public async analyze(): Promise<void> {
        // these function labels need to be more specific
        await this.updateGames();
        await this.updateOdds();
        await this.updateValues();
    }

    public async close(): Promise<void> {
        this.browser.close();
    }

    public async connectToExistingPage(): Promise<puppeteer.Page> {
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

    public async updateGames(): Promise<localModels.GameSet> {
        await this.updateGamesFunction();
        return this.gameSet;
    }

    public async updateOdds(): Promise<localModels.OddSet> {
        for (const game of this.gameSet) {
            for (const statistic of game.statisticSet) {
                await statistic.updateOdds({ exchange: this });
            }
        }

        return this.oddSet;
    }

    public async updateValues(): Promise<localModels.OddSet> {
        for (const odd of this.oddSet) {
            await odd.updateValues();
        }

        return this.oddSet;
    }

    // public static methods

    // getters and setters
    get browser(): puppeteer.Browser {
        if (this.wrappedBrowser) {
            return this.wrappedBrowser;
        } else {
            throw new Error(`${this.name} browser is null.`)
        }
    }

    set browser(browser: puppeteer.Browser) {
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

    get page(): puppeteer.Page {
        if (this.wrappedPage) {
            return this.wrappedPage;
        } else {
            throw new Error(`${this.name} page is null.`);
        }
    }

    set page(page: puppeteer.Page) {
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
}