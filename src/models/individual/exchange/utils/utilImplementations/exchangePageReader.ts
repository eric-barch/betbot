import * as puppeteer from 'puppeteer';

import { AbstractUtility } from "../abstractUtil";
import { HtmlScrape } from "../htmlScrape";
import * as config from '../../../../../config';

const verbosity = config.verbosity.models.individual.exchange.utils.utilImplementations["exchangePageReader.ts"];

export class ExchangePageReader extends AbstractUtility {

    async connectToExistingPage() {
        const verbose = verbosity.connectToExistingPage;
        verbose ? console.log() : null;
        verbose ? console.log(`Running ${this.connectToExistingPage.name} for ${this.getExchange().getName()}.`) : null;

        this.browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
        verbose ? console.log(`Browser connected to localhost:9222.`) : null;

        const targets = await this.browser.targets();
        if (targets instanceof Array<puppeteer.Target>) {
            verbose ? console.log(`Targets found: ${targets.length}`) : null;
        } else {
            throw new Error('Expected Target[].')
        }

        const target = targets.find(target => target.url() === this.getExchange().getUrl());
        if (target instanceof puppeteer.Target) {
            verbose ? console.log(`Target found with url ${target.url()}.`) : null;
        } else {
            throw new Error('Expected Target.')
        }

        const targetPage = await target.page(); // This is the point at which Puppeteer changes the viewport size to the default 800 x 600.
        if (targetPage instanceof puppeteer.Page) { // Sometimes here.
            this.page = targetPage; // Sometimes here.
            verbose ? console.log(`${this.getExchange().getName()}.page set to targetPage.`) : null;

            this.page.setViewport({
                // width: 1920,
                // height: 975,
                width: 1280,
                height: 800,
            });
        } else {
            throw new Error('Expected page.');
        }

        // await this.page.goto('https://example.com');
        // verbose ? console.log(`Page switched to example.com`) : null;
    }
    
    async initializeNewPageAndConnect() {
        const verbose = verbosity.initializeNewPageAndConnect;
        
        this.initialize();

        verbose ? console.log(`${this.exchange.getName()} ${this.constructor.name} connecting to ${this.exchange.getUrl()}.`) : null;

        try {
            await this.page?.goto(this.exchange.getUrl(), {
                waitUntil: 'load',
            });
            verbose ? console.log(`Connected successfully.`) : null;
        }catch (error) {
            verbose ? console.log(`Unable to connect. Site likely blocks bots.`) : null;
            await this.initialize();
        }

    }

    async scrape() {
        const verbose = verbosity.scrape;
        verbose ? console.log() : null;

        verbose ? console.log(`Running ${this.scrape.name} for ${this.getExchange().getName()}.`) : null;

        const pages = await this.browser!.pages();
        const pageExists = pages.some(page => page.url() === this.exchange.getUrl());

        if (pageExists) {
            verbose ? console.log(`Scraping ${this.exchange.getName()}.`) : null;

            const string = await this.page!.content();
            const scrapedAt = new Date();
    
            this.html = new HtmlScrape({
                string: string,
                scrapedAt: scrapedAt,
            });
    
            verbose ? console.log(`Scraped successfully. HtmlScrape saved to ${this.exchange.getNameCamelCase()}.pageReader.html.`) : null;
        } else {            
            verbose ? console.log(`Scrape failed. Page does not exist.`) : null;
        }
        
    }

}