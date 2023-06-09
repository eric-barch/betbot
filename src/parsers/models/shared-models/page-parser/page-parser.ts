import * as p from 'puppeteer';

import { PageParserInitData } from '@/config';
import { Exchange, League } from '@prisma/client';
import { DbExchangeConnection, DbLeagueConnection } from './db-connections';
import { OddButtonParserSet } from './odd-button-parser-set';
import { WebpageConnection } from './webpage-connection';

export abstract class PageParser {
  private pageParserInitData: PageParserInitData;
  private wrappedWebpageConnection: WebpageConnection | undefined;
  private wrappedDbExchangeConnection: DbExchangeConnection | undefined;
  private wrappedDbLeagueConnection: DbLeagueConnection | undefined;
  private wrappedOddButtonParserSet: OddButtonParserSet | undefined;

  protected constructor({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }) {
    this.pageParserInitData = pageParserInitData;
  }

  protected async init(): Promise<PageParser> {
    this.webpageConnection = await WebpageConnection.create({ parentPageParser: this });
    this.dbExchangeConnection = await DbExchangeConnection.create({ parentPageParser: this });
    this.dbLeagueConnection = await DbLeagueConnection.create({ parentPageParser: this });
    this.oddButtonParserSet = await this.initOddButtonParserSet();
    return this;
  }

  protected abstract initOddButtonParserSet(): Promise<OddButtonParserSet>;

  public async disconnect(): Promise<void> {
    await this.webpageConnection.disconnect();
  }

  public get exchangeName(): string {
    return this.pageParserInitData.exchangeInitData.name;
  }

  public get leagueName(): string {
    return this.pageParserInitData.leagueInitData.name;
  }

  public get url(): string {
    return this.pageParserInitData.url;
  }

  public get page(): p.Page {
    return this.webpageConnection.page;
  }

  private get webpageConnection(): WebpageConnection {
    if (!this.wrappedWebpageConnection) {
      throw new Error(`wrappedWebpageConnection is undefined.`);
    }

    return this.wrappedWebpageConnection;
  }

  private set webpageConnection(webpageConnection: WebpageConnection) {
    this.wrappedWebpageConnection = webpageConnection;
  }

  private set dbExchangeConnection(dbExchangeConnection: DbExchangeConnection) {
    this.wrappedDbExchangeConnection = dbExchangeConnection;
  }

  public get exchange(): Exchange {
    if (!this.wrappedDbExchangeConnection) {
      throw new Error(`wrappedDbExchangeConnection is undefined.`);
    }

    return this.wrappedDbExchangeConnection.exchange;
  }

  private set dbLeagueConnection(dbLeagueConnection: DbLeagueConnection) {
    this.wrappedDbLeagueConnection = dbLeagueConnection;
  }

  public get league(): League {
    if (!this.wrappedDbLeagueConnection) {
      throw new Error(`wrappedDbLeagueConnection is undefined.`);
    }

    return this.wrappedDbLeagueConnection.league;
  }

  protected set oddButtonParserSet(oddButtonParserSet: OddButtonParserSet) {
    this.wrappedOddButtonParserSet = oddButtonParserSet;
  }

  protected get oddButtonParserSet(): OddButtonParserSet {
    if (!this.wrappedOddButtonParserSet) {
      throw new Error(`wrappedOddButtonParserSet is undefined.`);
    }

    return this.wrappedOddButtonParserSet;
  }
}