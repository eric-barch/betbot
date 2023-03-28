import * as puppeteer from 'puppeteer';

import { GameSet } from '../game';
import { OddsSet } from '../odds';

import * as models from '../../models';

export class Exchange {
    private name: string;
    private url: string;
    private browser: puppeteer.Browser | null;
    private page: puppeteer.Page | null;
    private parseFunction: Function;
    private gamesGroup: GameSet;
    private oddsGroup: OddsSet;
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
        this.gamesGroup = new GameSet();
        this.oddsGroup = new OddsSet();
        this.sequelizeInstance = null;
    }

    public async analyze() {
        await this.scrape();
        await this.parse();
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

        this.page = targetPage;

        this.page.setViewport({
            // width: 1920,
            // height: 975,
            width: 1280,
            height: 800,
        });
    }

    public async initialize() {
        await this.connectToExistingPage();
        this.sequelizeInstance = new models.ExchangeSequelizeInstance({exchange: this});
        await this.sequelizeInstance.initialize();
    }

    public async parse() {
        const currentExchangeGames = await this.parseFunction();
        return currentExchangeGames;
    }

    public async scrape() {

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

    public getUrl() {
        return this.url;
    }
}