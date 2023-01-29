import { Exchange } from "./exchanges"
import puppeteer, { Browser, Page } from "puppeteer";
import { Game } from "./games";
import * as fs from 'fs';


abstract class ExchangePageUtility {
    
    protected exchange: Exchange;
    protected html: HtmlScrape;
    protected browser: Browser | undefined;
    protected page: Page | undefined;

    constructor({
        exchange,
    }: {
        exchange: Exchange,
    }) {
        this.exchange = exchange;
        this.html = new HtmlScrape({string: ''});
        this.browser = undefined;
        this.page = undefined;
    }

    async initialize({
        headless = true,
        verbose = false,
    }: {
        headless?: boolean,
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`Initializing ${this.constructor.name} for ${this.exchange.getName()}.`) : null;
    
        this.browser = await puppeteer.launch({headless: headless});
        this.page = await this.browser.newPage();

        let pages = await this.browser.pages();
        let blankTab = pages.shift();
        await blankTab?.close();
    
        verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} initialized succesfully.`) : null;
    }

    async saveHtml({
        filepath,
        verbose = false,
    }: {
        filepath: string,
        verbose?: boolean,
    }) {
        const scrapedAt = this.getHtml().getScrapedAt();
        const year = scrapedAt.getFullYear();
        const month = ("0" + (scrapedAt.getMonth() + 1)).slice(-2);
        const day = ("0" + scrapedAt.getDate()).slice(-2);
        const hour = ("0" + scrapedAt.getHours()).slice(-2);
        const minute = ("0" + scrapedAt.getMinutes()).slice(-2);
        const second = ("0" + scrapedAt.getSeconds()).slice(-2);
        const milliseconds = ("00" + scrapedAt.getMilliseconds()).slice(-3);
        const filename = `${year}.${month}.${day} ${hour}.${minute}.${second}.${milliseconds} ${this.getExchange().getName()}.html`;
        fs.writeFileSync(`${filepath}/${filename}`, this.getHtml().getString(), { encoding: 'utf8' });
        console.log(`HTML file saved as ${filename}`);
    }

    async close({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`Closing ${this.constructor.name} for ${this.exchange.getName()}.`) : null;
        
        await this.browser?.close();

        verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} closed successfully.`) : null;
    }

    // Public methods

    
    // Getters
    public getExchange({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.exchange;
    }

    public getHtml({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.html;
    }

    public getPage({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.page;
    }

    // Setters
    public setHtml({
        html,
        verbose = false,
    }: {
        html: HtmlScrape,
        verbose?: boolean,
    }) {
        this.html = html;
    }

}

export class ExchangePageReader extends ExchangePageUtility {

    async connect({
        headless = true,
        verbose = false,
    }: {
        headless?: boolean,
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`\nConnecting ${this.constructor.name} for ${this.exchange.getName()} to ${this.exchange.getUrl()}.`) : null;

        try {
            await this.page?.goto(this.exchange.getUrl(), {
                waitUntil: 'load',
            });
            verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} connected to ${this.exchange.getUrl()} successfully.`) : null;
        }catch (error) {
            verbose ? console.log(`${this.constructor.name} for ${this.exchange.getName()} unable to connect to ${this.exchange.getUrl()}. Site likely blocks bot traffic.`) : null;
            await this.initialize({headless: headless, verbose: verbose});
        }

    }

    async scrape({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {

        const pages = await this.browser!.pages();
        const pageExists = pages.some(page => page.url() === this.exchange.getUrl());

        if (pageExists) {
            verbose ? console.log(`\nScraping ${this.exchange.getName()}.`) : null;

            const string = await this.page!.content();
            const scrapedAt = new Date();
    
            this.html = new HtmlScrape({
                string: string,
                scrapedAt: scrapedAt,
            });
    
            verbose ? console.log(`${this.exchange.getName()} scraped successfully.`) : null;
        } else {            
            verbose ? console.log(`Cannot scrape ${this.exchange.getName()}. Page does not exist.`) : null;
        }
        
    }

}

export class ExchangePageParser extends ExchangePageUtility {
    private parseFunction: Function;

    constructor({
        exchange,
        parseFunction,
    }: {
        exchange: Exchange,
        parseFunction: Function,
    }) {
        super({exchange: exchange});
        this.parseFunction = parseFunction;
    }

    async parseGames({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        await this.parseFunction();
    }

}

export class ExchangePageWriter extends ExchangePageUtility {

}

class HtmlScrape {
    private string: string;
    private scrapedAt: Date;

    constructor({
        string,
        scrapedAt,
    }: {
        string: string,
        scrapedAt?: Date,
    }) {
        this.string = string;
        scrapedAt ? this.scrapedAt = scrapedAt : this.scrapedAt = new Date();
    }

    // Public methods

    
    // Getters
    public getString({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.string;
    }

    public getScrapedAt({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.scrapedAt;
    }

}