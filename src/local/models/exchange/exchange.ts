import * as puppeteer from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Exchange {
    // public properties
    public name: string;
    public url: string;

    // private properties
    private wrappedUpdateGamesFunction: Function | undefined;
    private wrappedUpdateStatisticsFunction: Function | undefined;
    
    // public linked objects
    public gameSet: localModels.GameSet;
    public statisticSet: localModels.StatisticSet;
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
    }: {
        name: string,
        url: string,
    }) {
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
    public static async create({
        name,
        url,
    }: {
        name: string,
        url: string,
    }): Promise<Exchange> {
        const newExchange = new Exchange({
            name: name,
            url: url,
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

    public async updateStatistics(): Promise<localModels.StatisticSet> {
        await this.updateStatisticsFunction();
        return this.statisticSet;
    }

    public async updateOdds() {
        for (const statistic of this.statisticSet) {
            const updateOddFunction = globalModels.updateOddFunctions.get(`${this.nameCamelCase}_${statistic.name}`);

            if (!updateOddFunction) {
                throw new Error(`Did not find corresponding update odd function.`);
            }

            const oddExists = await updateOddFunction({
                exchange: this,
                statistic: statistic,
            });

            if (oddExists) {
                const odd = await this.oddSet.findOrCreate({
                    exchange: this,
                    statistic: statistic,
                    updateOddElementsFunction: updateOddFunction,
                });
                this.oddSet.add(odd);
                statistic.oddSet.add(odd);
            }
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

    get updateGamesFunction(): Function {
        if (!this.wrappedUpdateGamesFunction) {
            throw new Error(`wrappedUpdateGamesFunction is undefined.`);
        }

        return this.wrappedUpdateGamesFunction;
    }

    set updateGamesFunction(updateGamesFunction: Function | undefined) {
        if (!updateGamesFunction) {
            throw new Error(`updateGamesFunction is undefined.`);
        }
        
        this.wrappedUpdateGamesFunction = updateGamesFunction.bind(this);
    }

    get updateStatisticsFunction(): Function {
        if (!this.wrappedUpdateStatisticsFunction) {
            throw new Error(`wrappedUpdateStatisticsFunction is undefined.`);
        }

        return this.wrappedUpdateStatisticsFunction;
    }

    set updateStatisticsFunction(updateStatisticsFunction: Function | undefined) {
        if (!updateStatisticsFunction) {
            throw new Error(`updateStatisticsFunction is undefined.`);
        }
        
        this.wrappedUpdateStatisticsFunction = updateStatisticsFunction.bind(this);
    }
}