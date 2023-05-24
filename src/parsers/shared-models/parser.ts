import * as p from 'puppeteer';

import { WebpageConnection } from './webpage-connection';

export abstract class Parser {
  private wrappedWebpageConnection: WebpageConnection;

  constructor({ url }: { url: string }) {
    this.wrappedWebpageConnection = new WebpageConnection({ url });
  }

  public async connect(): Promise<void> {
    await this.wrappedWebpageConnection.connect();
  }

  get page(): p.Page {
    return this.wrappedWebpageConnection.page;
  }
}
