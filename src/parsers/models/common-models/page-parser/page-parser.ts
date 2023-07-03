import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import {
  OddButtonParserSet, PageParserDbConnection, SpecializedParserFactory, WebpageConnection
} from '@/parsers/models/common-models';

export class PageParser {
  public readonly pageUrl: string;
  private wrappedWebpageConnection: WebpageConnection | undefined;
  private wrappedDbConnection: PageParserDbConnection | undefined;
  private wrappedSpecializedParserFactory: SpecializedParserFactory | undefined;
  private wrappedOddButtonParserSet: OddButtonParserSet | undefined;

  private constructor({
    pageUrl,
  }: {
    pageUrl: string,
  }) {
    this.pageUrl = pageUrl;
  }

  public static async create({
    pageUrl,
  }: {
    pageUrl: string,
  }): Promise<PageParser> {
    const pageParser = new PageParser({ pageUrl });
    await pageParser.init();
    return pageParser;
  }

  private async init(): Promise<PageParser> {
    this.dbConnection = await PageParserDbConnection.create({ parentPageParser: this });
    this.webpageConnection = await WebpageConnection.create({ parentPageParser: this });
    this.specializedParserFactory = await SpecializedParserFactory.create({ parentPageParser: this });
    this.oddButtonParserSet = await OddButtonParserSet.create({ parentPageParser: this });
    return this;
  }

  private async reset(): Promise<PageParser> {
    await this.webpageConnection.reset();
    this.oddButtonParserSet = await OddButtonParserSet.create({ parentPageParser: this });
    return this;
  }

  public async update(): Promise<PageParser> {
    try {
      await this.oddButtonParserSet.update();
    } catch {
      console.log(`Resetting page parser...`);
      await this.reset();
    }

    return this;
  }

  public async disconnect(): Promise<void> {
    await this.webpageConnection.disconnect();
    await this.oddButtonParserSet.disconnect();
  }

  public get page(): Page {
    return this.webpageConnection.page;
  }

  public get exchange(): Exchange {
    return this.dbConnection.exchange;
  }

  public get league(): League {
    return this.dbConnection.league;
  }

  private set dbConnection(dbConnection: PageParserDbConnection) {
    this.wrappedDbConnection = dbConnection;
  }

  private get dbConnection(): PageParserDbConnection {
    if (this.wrappedDbConnection === undefined) {
      throw new Error(`wrappedDbConnection is undefined.`);
    }

    return this.wrappedDbConnection;
  }

  private set specializedParserFactory(specializedParserFactory: SpecializedParserFactory) {
    this.wrappedSpecializedParserFactory = specializedParserFactory;
  }

  public get specializedParserFactory(): SpecializedParserFactory {
    if (!this.wrappedSpecializedParserFactory) {
      throw new Error(`wrappedSpecializedParserFactory is undefined.`);
    }

    return this.wrappedSpecializedParserFactory;
  }

  private set webpageConnection(webpageConnection: WebpageConnection) {
    this.wrappedWebpageConnection = webpageConnection;
  }

  private get webpageConnection(): WebpageConnection {
    if (!this.wrappedWebpageConnection) {
      throw new Error(`wrappedWebpageConnection is undefined.`);
    }

    return this.wrappedWebpageConnection;
  }

  private set oddButtonParserSet(oddButtonParserSet: OddButtonParserSet) {
    this.wrappedOddButtonParserSet = oddButtonParserSet;
  }

  private get oddButtonParserSet(): OddButtonParserSet {
    if (!this.wrappedOddButtonParserSet) {
      throw new Error(`wrappedOddButtonParserSet is undefined.`);
    }

    return this.wrappedOddButtonParserSet;
  }
}