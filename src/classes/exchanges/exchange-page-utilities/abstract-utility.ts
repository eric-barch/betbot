import * as classes from '../..';
import * as puppeteer from "puppeteer";
import * as fs from 'fs';

export abstract class AbstractUtility {
    
    protected exchange: classes.exchanges.Exchange;
    protected html: classes.exchanges.exchangePageUtilities.HtmlScrape;
    protected browser: puppeteer.Browser | undefined;
    protected page: puppeteer.Page | undefined;

    constructor({
        exchange,
    }: {
        exchange: classes.exchanges.Exchange,
    }) {
        this.exchange = exchange;
        this.html = new classes.exchanges.exchangePageUtilities.HtmlScrape({string: ''});
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
        this.browser = await puppeteer.launch({headless: headless});
        this.page = await this.browser.newPage();

        let pages = await this.browser.pages();
        let blankTab = pages.shift();
        await blankTab?.close();
    
        verbose ? console.log(`${this.getExchange().getName()} ${this.constructor.name} initialized succesfully.`) : null;
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
        const exchangeNameStripped = this.getExchange().getNameStripped();
        const filename = `${year}.${month}.${day} ${hour}.${minute}.${second}.${milliseconds} ${exchangeNameStripped}.html`;
        fs.writeFileSync(`${filepath}/${exchangeNameStripped}/${filename}`, this.getHtml().getString(), { encoding: 'utf8' });
        verbose ? console.log(`${this.getExchange().getName()} HTML file saved as \'${filename}\'`) : null;
    }

    async close({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        await this.browser?.close();
        verbose ? console.log(`${this.getExchange().getName()} ${this.constructor.name} closed successfully.`) : null;
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
    private setHtml({
        html,
        verbose = false,
    }: {
        html: classes.exchanges.exchangePageUtilities.HtmlScrape,
        verbose?: boolean,
    }) {
        this.html = html;
        verbose ? console.log(`${this.getExchange().getName()} ${this.constructor.name} HtmlScrape set.`) : null;
    }

    public async setPageContent({
        html = this.html,
        verbose = false,
    }: {
        html?: classes.exchanges.exchangePageUtilities.HtmlScrape,
        verbose?: boolean,
    } = {}) {
        html ? this.setHtml({html: html, verbose: verbose}) : null;
        await this.page?.setContent(this.getHtml().getString());
        verbose ? console.log(`${this.getExchange().getName()} ${this.constructor.name} Page content set.`) : null;
    }

}
console.log(`\nInitialized and imported classes.exchangePageUtilities.AbstractUtility.`);