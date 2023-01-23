import { Exchange } from "./exchange"
import puppeteer, { Browser, Page } from "puppeteer";

export class ExchangePageUtility {
    private exchange: Exchange;
    private html: HtmlScrape;
    private browser: Browser | undefined;
    private page: Page | undefined;

    constructor({
        exchange,
    }: {
        exchange: Exchange,
    }) {
        this.exchange = exchange;
        this.html = new HtmlScrape;
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
        verbose ? console.log(`Initializing ExchangePageUtility object for ${this.exchange.getName()}.`) : null;
        
        this.browser = await puppeteer.launch({headless: headless});
        this.page = await this.browser.newPage();

        verbose ? console.log(`ExchangePageUtility object for ${this.exchange.getName()} initialized succesfully.`) : null;
    }
}


export class ExchangePageReader {

}

export class ExchangePageParser {
    
}

export class ExchangePageWriter {
    
}

class HtmlScrape {

}