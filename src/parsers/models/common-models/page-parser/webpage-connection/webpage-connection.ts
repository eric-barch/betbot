import { spawn } from 'child_process';

import { Browser, Page, connect, executablePath } from 'puppeteer';

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
    await webpageConnection.init();
    return webpageConnection;
  }

  private async init(): Promise<WebpageConnection> {
    await this.connect();
    return this;
  }

  private async connect(): Promise<WebpageConnection> {
    await this.connectToBrowser();
    await this.connectToPage();
    return this;
  }

  private async connectToBrowser(): Promise<Browser> {
    try {
      this.browser = await this.connectToExistingBrowser();
    } catch {
      this.browser = await this.connectToNewBrowser();
    }

    return this.browser;
  }

  private async connectToExistingBrowser(): Promise<Browser> {
    this.browser = await connect({
      browserURL: 'http://127.0.0.1:9222',
    })

    return this.browser;
  }

  private async connectToExistingBrowserWithRetries(): Promise<Browser> {
    let attempts = 0;
    const maxAttempts = 10;
    const delayBetweenAttempts = 1000;

    while (attempts < maxAttempts) {
      try {
        this.browser = await this.connectToExistingBrowser();
        return this.browser;
      } catch (error) {
        console.log('Failed to connect. Retrying...');
        await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
        attempts++;
      }
    }

    throw new Error('Failed to connect to Chromium after multiple attempts.');
  }

  private async connectToNewBrowser(): Promise<Browser> {
    const browserPath = executablePath();

    return new Promise<Browser>(async (resolve, reject) => {
      const child = spawn(browserPath, [
        '--headless=new',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--remote-debugging-port=9222'
      ], {
        detached: true,
        stdio: 'ignore'
      });

      // Listen to error event
      child.on('error', (error) => {
        reject(`Failed to start the browser due to: ${error.message}`);
      });

      // Listen to exit event
      child.on('exit', (code) => {
        if (code !== 0) {
          reject(`Browser process exited with code: ${code}`);
        }
      });

      setTimeout(() => {
        reject('Timed out waiting for the browser to connect.');
      }, 10000); // 10 seconds timeout

      try {
        this.browser = await this.connectToExistingBrowserWithRetries();
        resolve(this.browser);
      } catch {
        reject(`Failed to connect to the browser.`);
      }
    });
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
