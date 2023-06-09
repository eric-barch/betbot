import * as p from 'puppeteer';

import { PageParser } from '../page-parser';

export class WebpageConnection {
  private url: string;
  private wrappedBrowser: p.Browser | undefined;
  private wrappedPage: p.Page | undefined;

  constructor({
    parentPageParser
  }: {
    parentPageParser: PageParser
  }) {
    this.url = parentPageParser.url;
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

  private async connectToBrowser(): Promise<p.Browser> {
    this.browser = await p.connect({
      browserURL: 'http://127.0.0.1:9222',
    });

    return this.browser;
  }

  private async connectToPage(): Promise<p.Page> {
    try {
      this.page = await this.connectToExistingPage();
    } catch {
      this.page = await this.connectToNewPage();
    }

    return this.page;
  }

  private async connectToExistingPage(): Promise<p.Page> {
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

  private async connectToNewPage(): Promise<p.Page> {
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

  public async disconnect(): Promise<void> {
    this.browser.disconnect();
  }

  private set browser(browser: p.Browser) {
    this.wrappedBrowser = browser;
  }

  private get browser(): p.Browser {
    if (!this.wrappedBrowser) {
      throw new Error(`wrappedBrowser is null.`);
    }

    return this.wrappedBrowser;
  }

  private set page(page: p.Page) {
    this.wrappedPage = page;
  }

  public get page(): p.Page {
    if (!this.wrappedPage) {
      throw new Error(`wrappedPage is null.`);
    }

    return this.wrappedPage;
  }
}
