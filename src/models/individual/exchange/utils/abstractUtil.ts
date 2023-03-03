import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

import * as config from '../../../../config';
import * as models from '../../../../models';

export abstract class AbstractUtility {
    
    protected exchange: models.Exchange;
    protected html: models.HtmlScrape;
    protected browser: puppeteer.Browser | undefined;
    protected page: puppeteer.Page | undefined;

    constructor({
        exchange,
    }: {
        exchange: models.Exchange,
    }) {
        this.exchange = exchange;
        this.html = new models.HtmlScrape({string: ''});
        this.browser = undefined;
        this.page = undefined;
    }

    async initialize() {    
        const headless = config.headless;

        this.browser = await puppeteer.launch({
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            headless: headless
        });
        this.page = await this.browser.newPage();

        let pages = await this.browser.pages();
        let blankTab = pages.shift();
        await blankTab?.close();
    }

    async saveHtml({
        filepath,
    }: {
        filepath: string,
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
    }

    async close() {
        await this.browser?.close();
    }
    
    // Getters
    public getExchange() {
        return this.exchange;
    }

    public getHtml() {
        return this.html;
    }

    public getPage() {
        return this.page;
    }

    // Setters
    private setHtml({
        html,
    }: {
        html: models.HtmlScrape,
    }) {
        this.html = html;
    }

    public async setPageContent({
        html = this.html,
    }: {
        html: models.HtmlScrape,
    }) {
        this.setHtml({html: html});
        await this.page?.setContent(this.getHtml().getString());
    }
}