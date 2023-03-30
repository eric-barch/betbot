import * as puppeteer from 'puppeteer';

import * as models from '..';

export class Exchange {
    private name: string;
    private url: string;
    private browser: puppeteer.Browser | null;
    private page: puppeteer.Page | null;
    private parseFunction: Function;
    private gamesGroup: models.GameSet;
    private oddsGroup: models.OddsSet;
    private sequelizeInstance: models.ExchangeSequelizeInstance | null;

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
        this.browser = null;
        this.page = null;
        this.parseFunction = parseFunction;
        this.gamesGroup = new models.GameSet();
        this.oddsGroup = new models.OddsSet();
        this.sequelizeInstance = null;
    }

    public async initialize() {
        await this.connectToExistingPage();
        this.sequelizeInstance = new models.ExchangeSequelizeInstance({exchange: this});
        await this.sequelizeInstance.initialize();
    }

    public async analyze() {
        const currentOdds = await this.getCurrentOdds();
        // Some method that compares the current odds with the odds saved in MySQL and updates them if necessary.
    }

    public async close() {
        if (this.browser !== null) {
            await this.browser.close();
        } else {
            throw new Error(`${this.constructor.name}.${this.close.name} failed. Browser is null.`);
        }
    }

    public async connectToExistingPage() {
        this.browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });

        const targets = await this.browser.targets();
        if (!(targets instanceof Array<puppeteer.Target>)) {
            throw new Error('Expected Array<puppeteer.Target>.');
        }

        const url = this.getUrl();
        const target = targets.find(target => target.url() === url);
        if (!(target instanceof puppeteer.Target)) {
            throw new Error('Expected Target.');
        }

        const targetPage = await target.page(); // This is the point at which Puppeteer changes the viewport size to the default 800 x 600.
        if (!(targetPage instanceof puppeteer.Page)) {
            throw new Error('Expected page.');
        }

        // Get the window size in pixels
        const windowSize = await targetPage.evaluate(() => {
            return {
                width: window.outerWidth,
                height: window.outerHeight - 75 // This seems to be roughly the height of the Chrome navigation bar. Find a less hacky way to do this.
            };
        });

        this.page = targetPage;

        this.page.setViewport(windowSize);
    }

    public getAll() {
        return models.allExchanges;
    }

    public async getCurrentOdds() {
        const currentOdds = await this.parseFunction();
        return currentOdds;
    }
    
    public getGamesGroup() {
        return this.gamesGroup;
    }

    public getName() {
        return this.name;
    }

    public getNameStripped() {
        return this.getName().replace(/[^a-zA-Z0-9]/g, '');
    }

    public getNameCamelCase() {
        let alphanumericString = this.getNameStripped();
        let firstCharLower = alphanumericString.charAt(0).toLowerCase() + alphanumericString.slice(1);
        return firstCharLower;
    }

    public getOddsGroup() {
        return this.oddsGroup;
    }

    public getPage() {
        return this.page;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }

    public getUrl() {
        return this.url;
    }
}