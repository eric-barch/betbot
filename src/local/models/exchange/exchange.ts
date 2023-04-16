import { connect, Browser, Page } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Exchange {
    // public properties
    public name: string;
    public url: string;

    // private properties
    private wrappedUpdateGamesFunction: Function;
    private wrappedUpdateStatisticsFunction: Function;
    
    // public linked objects
    public gameSet: localModels.GameSet;
    public statisticSet: localModels.StatisticSet;
    public oddSet: localModels.OddSet;
    
    // private linked objects
    private wrappedBrowser: Browser | null;
    private wrappedPage: Page | null;

    // private sequelize object
    private wrappedSqlExchange: databaseModels.Exchange | null;

    // private constructor
    private constructor({
        name,
        url,
        updateGamesFunction,
        updateStatisticsFunction,
    }: {
        name: string,
        url: string,
        updateGamesFunction: Function,
        updateStatisticsFunction: Function,
    }) {
        this.name = name;
        this.url = url;

        this.wrappedUpdateGamesFunction = updateGamesFunction.bind(this);
        this.wrappedUpdateStatisticsFunction = updateStatisticsFunction.bind(this);
        
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
        updateGamesFunction,
        updateStatisticsFunction,
    }: {
        name: string,
        url: string,
        updateGamesFunction: Function,
        updateStatisticsFunction: Function,
    }): Promise<Exchange> {
        const newExchange = new Exchange({
            name: name,
            url: url,
            updateGamesFunction: updateGamesFunction,
            updateStatisticsFunction: updateStatisticsFunction,
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

    public async updateGames(): Promise<localModels.GameSet> {
        await this.updateGamesFunction();
        return this.gameSet;
    }

    public async updateOdds() {
        for (const statistic of this.statisticSet) {
            const updateElementsFunction = globalModels.updateElementsFunctions.get(`${this.nameCamelCase}_${statistic.name}`);

            if (!updateElementsFunction) {
                throw new Error(`Did not find corresponding update elements function.`);
            }

            const oddExists = await updateElementsFunction({
                exchange: this,
                statistic: statistic,
            });

            const updateValuesFunction = globalModels.updateValuesFunctions.get(`${this.nameCamelCase}`);

            if (!updateValuesFunction) {
                throw new Error(`Did not find corresponding update values function.`);
            }

            if (oddExists) {
                const odd = await this.oddSet.findOrCreate({
                    exchange: this,
                    statistic: statistic,
                    updateElementsFunction: updateElementsFunction,
                    updateValuesFunction: updateValuesFunction
                });
                this.oddSet.add(odd);
                statistic.oddSet.add(odd);
            }
        }

        return this.oddSet;
    }

    public async updateStatistics(): Promise<localModels.StatisticSet> {
        await this.updateStatisticsFunction();
        return this.statisticSet;
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
        if (!this.wrappedUpdateGamesFunction) {
            throw new Error(`wrappedUpdateGamesFunction is undefined.`);
        }

        return this.wrappedUpdateGamesFunction;
    }

    set updateGamesFunction(updateGamesFunction: Function) {
        this.wrappedUpdateGamesFunction = updateGamesFunction.bind(this);
    }

    get updateStatisticsFunction(): Function {
        if (!this.wrappedUpdateStatisticsFunction) {
            throw new Error(`wrappedUpdateStatisticsFunction is undefined.`);
        }

        return this.wrappedUpdateStatisticsFunction;
    }

    set updateStatisticsFunction(updateStatisticsFunction: Function) {
        this.wrappedUpdateStatisticsFunction = updateStatisticsFunction.bind(this);
    }
}