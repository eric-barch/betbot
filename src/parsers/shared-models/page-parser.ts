import * as p from 'puppeteer';

import { WebpageConnection } from './webpage-connection';

import * as db from '../../db';

export abstract class PageParser {
  private wrappedSequelizePage: db.models.Page | undefined;
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

  set sequelizePage(sequelizePage: db.models.Page) {
    this.wrappedSequelizePage = sequelizePage;
  }
}
