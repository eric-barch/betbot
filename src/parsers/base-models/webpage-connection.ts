import * as p from 'puppeteer';

export class WebpageConnection {
    private wrappedUrl: string | undefined;
    private wrappedBrowser: p.Browser | undefined;
    private wrappedPage: p.Page | undefined;

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

        this.wrappedPage = targetPage;
        this.page.setViewport(windowSize);

        return this.page;
    }

    private async connectToNewPage(): Promise<p.Page> {
        this.wrappedPage = await this.browser.newPage();

        const url = this.url;

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

    get url(): string {
        if (!this.wrappedUrl) {
            throw new Error(`wrappedUrl is undefined.`);
        }

        return this.wrappedUrl;
    }

    set url(url: string) {
        this.wrappedUrl = url;
    }

    private get browser(): p.Browser {
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