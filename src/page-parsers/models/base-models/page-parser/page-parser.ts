import * as p from 'puppeteer';

import { prisma } from '@/db';
import { PageParserInitializer } from './page-parser-initializer';
import { PageParserInitData } from '@/init-data';
import { WebpageConnection } from './webpage-connection';
import { Exchange, League, Game, Statistic, Odd } from '@prisma/client';
import { OddHandle } from './odd-handle';

export abstract class PageParser {
  private initializer: PageParserInitializer;
  private wrappedWebpageConnection: WebpageConnection | undefined;
  private wrappedExchange: Exchange | undefined;
  private wrappedLeague: League | undefined;
  protected games: Array<Game>;
  protected statistics: Array<Statistic>;
  protected odds: Array<Odd>;
  protected oddHandles: Set<OddHandle>;

  constructor({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }) {
    this.initializer = new PageParserInitializer({
      pageParser: this,
      pageParserInitData,
    });
    this.games = new Array<Game>;
    this.statistics = new Array<Statistic>;
    this.odds = new Array<Odd>;
    this.oddHandles = new Set<OddHandle>;
  }

  protected async init(): Promise<PageParser> {
    this.wrappedWebpageConnection = await this.initializer.initWebpageConnection();
    this.wrappedExchange = await this.initializer.initExchange();
    this.wrappedLeague = await this.initializer.initLeague();
    return this;
  }

  public async update() {
    await this.updateGames();
  }

  protected abstract updateGames(): Promise<Array<Game>>;

  // protected abstract updateStatistics(): Promise<Array<Statistic>>;

  private get webpageConnection(): WebpageConnection {
    if (!this.wrappedWebpageConnection) {
      throw new Error(`wrappedWebpageConnection is undefined.`);
    }

    return this.wrappedWebpageConnection;
  }

  public get page(): p.Page {
    return this.webpageConnection.page;
  }

  public get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }

  public get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}