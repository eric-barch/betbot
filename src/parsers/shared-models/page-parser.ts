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

  public async getGames(): Promise<Array<db.models.Game>> {
    const games = await this.scrapeGames();

    const page = this.sequelizePage;

    for (const game of games) {
      await page.addGame(game);
    }

    return games;
  }

  protected abstract scrapeGames(): Promise<Array<db.models.Game>>;

  get page(): p.Page {
    return this.wrappedWebpageConnection.page;
  }

  public get sequelizePage(): db.models.Page {
    if (!this.wrappedSequelizePage) {
      throw new Error(`wrappedSequelizePage is undefined.`);
    }

    return this.wrappedSequelizePage;
  }

  set sequelizePage(sequelizePage: db.models.Page) {
    this.wrappedSequelizePage = sequelizePage;
  }
}
