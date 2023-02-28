import * as models from '../../../../../models';

export class ExchangePageReader extends models.AbstractUtility {

    async connect({
        headless = true,
        verbose = false,
    }: {
        headless?: boolean,
        verbose?: boolean,
    } = {}) {
        verbose ? console.log(`${this.exchange.getName()} ${this.constructor.name} connecting to ${this.exchange.getUrl()}.`) : null;

        try {
            await this.page?.goto(this.exchange.getUrl(), {
                waitUntil: 'load',
            });
            verbose ? console.log(`Connected successfully.`) : null;
        }catch (error) {
            verbose ? console.log(`Unable to connect. Site likely blocks bots.`) : null;
            await this.initialize({headless: headless, verbose: verbose});
        }

    }

    async scrape() {
        const verbose = false;

        const pages = await this.browser!.pages();
        const pageExists = pages.some(page => page.url() === this.exchange.getUrl());

        if (pageExists) {
            verbose ? console.log(`Scraping ${this.exchange.getName()}.`) : null;

            const string = await this.page!.content();
            const scrapedAt = new Date();
    
            this.html = new models.HtmlScrape({
                string: string,
                scrapedAt: scrapedAt,
            });
    
            verbose ? console.log(`Scraped successfully. HtmlScrape saved to ${this.exchange.getNameCamelCase()}.pageReader.html.`) : null;
        } else {            
            verbose ? console.log(`Scrape failed. Page does not exist.`) : null;
        }
        
    }

}