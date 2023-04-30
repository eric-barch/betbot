import { Browser, Page, connect } from 'puppeteer';
import { Exchange } from './exchange';

export class ConnectionManager {
    public url: string;
    private wrappedExchange: Exchange;

    private wrappedBrowser: Browser | null;
    private wrappedPage: Page | null;

    public constructor({
        exchange,
    }: {
        exchange: Exchange,
    }) {
        this.url = exchange.url;
        this.wrappedExchange = exchange;

        this.wrappedBrowser = null;
        this.wrappedPage = null;
    }

    public async connect() {
        await this.connectToBrowser();
        await this.connectToPage();
    }

    public async connectToBrowser(): Promise<Browser> {
        try {
            this.browser = await connect({ browserURL: 'http://127.0.0.1:9222' });
        } catch {
            throw new Error(`Browser is not open with debugging enabled.`);
            // const chromeExecutablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google\ Chrome';

            // const browser = await launch({
            //     headless: false,
            //     executablePath: chromeExecutablePath,
            //     args: [
            //         '--remote-debugging-port=9222',
            //         '--no-first-run',
            //         '--no-default-browser-check',
            //     ]
            // });

            // this.browser = browser;
        }

        return this.browser;
    }

    protected async connectToPage(): Promise<Page> {
        try {
            await this.connectToExistingPage();
        } catch {
            await this.connectToNewPage();
        }

        return this.page;
    }

    private async connectToExistingPage(): Promise<Page> {
        const targets = this.browser.targets();
        const target = targets.find(target => target.url().includes(this.url));
        
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
                height: window.outerHeight,
            };
        });

        this.page = targetPage;
        this.page.setViewport(windowSize);

        return this.page;
    }

    private async connectToNewPage(): Promise<Page> {
        this.page = await this.browser.newPage();
        await this.page.goto(this.url);

        const windowSize = await this.page.evaluate(() => {
            return {
                width: window.outerWidth,
                height: window.outerHeight,
            };
        });

        this.page.setViewport(windowSize);

        return this.page;
    }

    public async close(): Promise<void> {
        await this.browser.close();
    }

    get exchange(): Exchange {
        return this.wrappedExchange;
    }

    get browser(): Browser {
        if (!this.wrappedBrowser) {
            throw new Error(`${this.exchange.name} browser is null.`)
        }

        return this.wrappedBrowser;
    }

    set browser(browser: Browser) {
        this.wrappedBrowser = browser;
    }

    get page(): Page {
        if (!this.wrappedPage) {
            throw new Error(`${this.exchange.name} page is null.`);
        }
        
        return this.wrappedPage;
    }

    set page(page: Page) {
        this.wrappedPage = page;
    }
}