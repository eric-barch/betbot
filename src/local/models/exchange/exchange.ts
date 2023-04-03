import { Browser, Page, connect } from 'puppeteer';

import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Exchange {
    public name: string;
    public url: string;
    public gameSet: localModels.GameSet;
    public oddSet: localModels.OddSet;
    public parseFunction: Function;
    
    private wrappedBrowser: Browser | null;
    private wrappedPage: Page | null;
    private wrappedSqlExchange: databaseModels.Exchange | null;

    constructor({
        name,
        url,
        parseFunction,
    }: {
        name: string,
        url: string,
        parseFunction: Function,
    }) {
        this.name = name;
        this.url = url;
        this.gameSet = new localModels.GameSet();
        this.oddSet = new localModels.OddSet();
        this.parseFunction = parseFunction;

        this.wrappedBrowser = null;
        this.wrappedPage = null;
        this.wrappedSqlExchange = null;
    }

    // async construction methods
    static async create({
        name,
        url,
        parseFunction,
    }: {
        name: string,
        url: string,
        parseFunction: Function,
    }): Promise<Exchange> {
        const newExchange = new Exchange({
            name: name,
            url: url,
            parseFunction: parseFunction,
        })

        await newExchange.init();

        globalModels.allExchanges.add(newExchange);

        return newExchange;
    }

    private async init(): Promise<void> {
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
    }

    // instance methods
    public async analyze(): Promise<void> {
        await this.parseFunction();
    }

    public async close(): Promise<void> {
        this.browser.close();
    }

    public async connectToExistingPage(): Promise<void> {
        this.browser = await connect({ browserURL: 'http://127.0.0.1:9222' });

        const targets = this.browser.targets();
        const target = targets.find(target => target.url() === this.url);
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
}