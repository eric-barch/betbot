import * as p from 'puppeteer';

export class WebpageConnector {
    private wrappedUrl: string;
    private wrappedBrowser: p.Browser | undefined;
    private wrappedPage: p.Page | undefined;

    public constructor({
        url,
    }: {
        url: string,
    }) {
        this.wrappedUrl = url;
    }

    public async connect(): Promise<void> {
        await this.connectToBrowser();
        await this.connectToPage();
    }

    private async connectToBrowser(): Promise<p.Browser> {
        this.wrappedBrowser = await p.connect({ browserURL: 'http://127.0.0.1:9222' });
        return this.wrappedBrowser;
    }

    private async connectToPage(): Promise<p.Page> {
        try {
            this.wrappedPage = await this.connectToExistingPage();
        } catch {
            this.wrappedPage = await this.connectToNewPage();
        }

        return this.page;
    }

    private async connectToExistingPage(): Promise<p.Page> {
        const targets = this.browser.targets();
        const target = targets.find(target => target.url().includes(this.wrappedUrl));
        
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

        this.wrappedPage = targetPage;
        this.page.setViewport(windowSize);

        return this.page;
    }

    private async connectToNewPage(): Promise<p.Page> {
        this.wrappedPage = await this.browser.newPage();
        await this.page.goto(this.wrappedUrl);

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

    get browser(): p.Browser {
        if (!this.wrappedBrowser) {
            throw new Error(`wrappedBrowser is null.`);
        }

        return this.wrappedBrowser;
    }

    get page(): p.Page {
        if (!this.wrappedPage) {
            throw new Error(`wrappedPage is null.`);
        }

        return this.wrappedPage;
    }
}