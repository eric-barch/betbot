import { Browser, connect, Page } from 'puppeteer';

export class Webpage {
  private wrappedUrl: string;
  private wrappedBrowser: Browser | undefined;
  private wrappedPage: Page | undefined;

  constructor({
    url,
  }: {
    url: string,
  }) {
    this.wrappedUrl = url;
  }

  public static async create({
    url,
  }: {
    url: string,
  }): Promise<Webpage> {
    const webpageConnection = new Webpage({ url });
    await webpageConnection.connect();
    return webpageConnection;
  }

  private async connect(): Promise<Webpage> {
    await this.connectToBrowser();
    await this.connectToPage();
    return this;
  }

  private async connectToBrowser(): Promise<Browser> {
    this.browser = await connect({
      browserURL: 'http://127.0.0.1:9222',
    });

    return this.browser;
  }

  private async connectToPage(): Promise<Page> {
    try {
      this.page = await this.connectToExistingPage();
    } catch {
      this.page = await this.connectToNewPage();
    }

    await this.page.reload();

    return this.page;
  }

  private async connectToExistingPage(): Promise<Page> {
    const targets = this.browser.targets();
    const target = targets.find((target) => target.url().includes(this.wrappedUrl));

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

    await this.page.goto(this.wrappedUrl);

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

  private set browser(browser: Browser) {
    this.wrappedBrowser = browser;
  }

  private get browser(): Browser {
    if (!this.wrappedBrowser) {
      throw new Error(`wrappedBrowser is null.`);
    }

    return this.wrappedBrowser;
  }

  private set page(page: Page) {
    this.wrappedPage = page;
  }

  public get page(): Page {
    if (!this.wrappedPage) {
      throw new Error(`wrappedPage is null.`);
    }

    return this.wrappedPage;
  }
}
