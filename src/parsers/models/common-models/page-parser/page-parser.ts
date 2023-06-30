import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import {
  DbExchangeConnection, DbLeagueConnection, OddButtonParserSet, SpecializedParserFactory,
  SpecializedParserFactoryFactory, Webpage,
} from '@/parsers/models/common-models';

export class PageParser {
  public readonly pageUrl: string;
  private wrappedDbExchangeConnection: DbExchangeConnection | undefined;
  private wrappedDbLeagueConnection: DbLeagueConnection | undefined;
  private wrappedSpecializedParserFactory: SpecializedParserFactory | undefined;
  private wrappedWebpage: Webpage | undefined;
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
    this.dbExchangeConnection = await DbExchangeConnection.create({ parentPageParser: this });
    this.dbLeagueConnection = await DbLeagueConnection.create({ parentPageParser: this });
    this.specializedParserFactory = await SpecializedParserFactoryFactory.create({ parentPageParser: this });
    this.webpage = await Webpage.create({ parentPageParser: this });
    this.oddButtonParserSet = await OddButtonParserSet.create({
      parentPageParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    return this;
  }

  private async reset(): Promise<PageParser> {
    await this.webpage.reload();
    await this.oddButtonParserSet.reset();
    console.log(`${this.pageUrl} PageParser reset.`);
    return this;
  }

  public async updateOdds(): Promise<void> {
    try {
      await this.oddButtonParserSet.updateOdds();
    } catch {
      await this.reset();
    }
  }

  public async disconnect(): Promise<void> {
    await this.oddButtonParserSet.disconnect();
    await this.webpage.disconnect();
  }

  public get page(): Page {
    return this.webpage.page;
  }

  public get exchange(): Exchange {
    return this.dbExchangeConnection.exchange;
  }

  public get league(): League {
    return this.dbLeagueConnection.league;
  }

  private set dbExchangeConnection(dbExchangeConnection: DbExchangeConnection) {
    this.wrappedDbExchangeConnection = dbExchangeConnection;
  }

  private get dbExchangeConnection(): DbExchangeConnection {
    if (!this.wrappedDbExchangeConnection) {
      throw new Error(`wrappedDbExchangeConnection is undefined.`);
    }

    return this.wrappedDbExchangeConnection;
  }

  private set dbLeagueConnection(dbLeagueConnection: DbLeagueConnection) {
    this.wrappedDbLeagueConnection = dbLeagueConnection;
  }

  private get dbLeagueConnection(): DbLeagueConnection {
    if (!this.wrappedDbLeagueConnection) {
      throw new Error(`wrappedDbLeagueConnection is undefined.`);
    }

    return this.wrappedDbLeagueConnection;
  }

  private set specializedParserFactory(specializedParserFactory: SpecializedParserFactory) {
    this.wrappedSpecializedParserFactory = specializedParserFactory;
  }

  private get specializedParserFactory(): SpecializedParserFactory {
    if (!this.wrappedSpecializedParserFactory) {
      throw new Error(`wrappedSpecializedParserFactory is undefined.`);
    }

    return this.wrappedSpecializedParserFactory;
  }

  private set webpage(webpage: Webpage) {
    this.wrappedWebpage = webpage;
  }

  private get webpage(): Webpage {
    if (!this.wrappedWebpage) {
      throw new Error(`wrappedWebpage is undefined.`);
    }

    return this.wrappedWebpage;
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