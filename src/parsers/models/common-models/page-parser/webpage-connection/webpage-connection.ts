import { exec } from 'child_process';

import { Browser, connect, Page } from 'puppeteer';

import { PageParser } from '@/parsers/models/common-models';

export class WebpageConnection {
  private readonly url: string;
  private wrappedBrowser: Browser | undefined;
  private wrappedPage: Page | undefined;

  constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.url = parentPageParser.pageUrl;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<WebpageConnection> {
    const webpageConnection = new WebpageConnection({ parentPageParser });
    await webpageConnection.connect();
    return webpageConnection;
  }

  private async connect(): Promise<WebpageConnection> {
    await this.connectToBrowser();
    await this.connectToPage();
    return this;
  }

  private async connectToBrowser(): Promise<Browser> {
    try {
      await this.connectToOpenBrowser();
    } catch {
      console.log(`Did not find open browser. Attempting to open a new one and connect...`);
      exec('open -a "Google Chrome.app" --args --profile-directory=Default --remote-debugging-port=9222');
      await this.connectToOpenBrowserUntilSuccessful();
    }

    return this.browser;
  }

  private async connectToOpenBrowser(): Promise<Browser> {
    this.browser = await connect({
      browserURL: 'http://127.0.0.1:9222',
    })
    return this.browser;
  }

  private async connectToOpenBrowserUntilSuccessful(): Promise<Browser> {
    try {
      return await this.connectToOpenBrowser();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await this.connectToOpenBrowserUntilSuccessful();
    }
  }

  private async connectToPage(): Promise<Page> {
    try {
      this.page = await this.connectToExistingPage();
    } catch {
      this.page = await this.connectToNewPage();
    }

    return this.page;
  }

  private async connectToExistingPage(): Promise<Page> {
    const targets = this.browser.targets();
    const target = targets.find((target) => target.url().includes(this.url));

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
    await this.page.setViewport(windowSize);

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

    await this.page.setViewport(windowSize);

    return this.page;
  }

  public async reset(): Promise<WebpageConnection> {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.reload(),
    ]);
    return this;
  }

  public async disconnect(): Promise<void> {
    this.browser.disconnect();
  }

  private set browser(browser: Browser) {
    this.wrappedBrowser = browser;
  }

  private get browser(): Browser {
    if (!this.wrappedBrowser) {
      throw new Error(`wrappedBrowser is undefined.`);
    }

    return this.wrappedBrowser;
  }

  private set page(page: Page) {
    this.wrappedPage = page;
  }

  public get page(): Page {
    if (!this.wrappedPage) {
      throw new Error(`wrappedPage is undefined.`);
    }

    return this.wrappedPage;
  }
}
