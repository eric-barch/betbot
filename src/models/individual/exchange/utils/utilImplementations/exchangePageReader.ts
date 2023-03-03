import * as puppeteer from 'puppeteer';

import { AbstractUtility } from "../abstractUtil";
import { HtmlScrape } from "../htmlScrape";

export class ExchangePageReader extends AbstractUtility {

    async connectToExistingPage() {
        this.browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });

        const targets = await this.browser.targets();
        if (!(targets instanceof Array<puppeteer.Target>)) {
            throw new Error('Expected Target[].');
        }

        const target = targets.find(target => target.url() === this.getExchange().getUrl());
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
    
    async initializeNewPageAndConnect() {
        this.initialize();

        try {
            await this.page?.goto(this.exchange.getUrl(), {
                waitUntil: 'load',
            });
        }catch (error) {
            await this.initialize();
        }
    }

    async scrape() {
        const string = await this.page!.content();
        const scrapedAt = new Date();

        this.html = new HtmlScrape({
            string: string,
            scrapedAt: scrapedAt,
        });      
    }
}