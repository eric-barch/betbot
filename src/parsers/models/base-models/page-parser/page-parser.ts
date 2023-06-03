import * as p from 'puppeteer';

import { PageParserInitData } from '@/init-data';
import { Exchange, League } from '@prisma/client';
import { OddHandle } from '../../exchange-models/draft-kings/games-page-parser/odd-handle-set/odd-handle/odd-handle';
import { PageParserInitializer } from './page-parser-initializer';
import { WebpageConnection } from './webpage-connection';

export abstract class PageParser {
  private initializer: PageParserInitializer;
  private wrappedWebpageConnection: WebpageConnection | undefined;
  private wrappedExchange: Exchange | undefined;
  private wrappedLeague: League | undefined;
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
    this.oddHandles = new Set<OddHandle>;
  }

  protected async init(): Promise<PageParser> {
    this.wrappedWebpageConnection = await this.initializer.initWebpageConnection();
    this.wrappedExchange = await this.initializer.initExchange();
    this.wrappedLeague = await this.initializer.initLeague();
    return this;
  }

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