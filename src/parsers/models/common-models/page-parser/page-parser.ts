import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import {
  DbExchangeInitializer, DbLeagueInitializer, OddButtonParserSet, SpecializedParserFactory,
  SpecializedParserFactoryFactory, Webpage,
} from '@/parsers/models/common-models';

export class PageParser {
  public readonly pageUrl: string;
  private wrappedDbExchangeInitializer: DbExchangeInitializer | undefined;
  private wrappedDbLeagueInitializer: DbLeagueInitializer | undefined;
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
    this.dbExchangeInitializer = await DbExchangeInitializer.create({ parentPageParser: this });
    this.dbLeagueInitializer = await DbLeagueInitializer.create({ parentPageParser: this });
    this.specializedParserFactory = await SpecializedParserFactoryFactory.create({ parentPageParser: this });
    this.webpage = await Webpage.create({ url: this.pageUrl });
    this.oddButtonParserSet = await OddButtonParserSet.create({
      parentPageParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    return this;
  }

  private async reset(): Promise<PageParser> {
    await this.webpage.reload();
    this.oddButtonParserSet = await OddButtonParserSet.create({
      parentPageParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    return this;
  }

  public async updateOdds(): Promise<void> {
    try {
      await this.oddButtonParserSet.updateOdds();
    } catch {
      await this.oddButtonParserSet.deactivateOdds();
      await this.reset();
    }
  }

  public async disconnect(): Promise<void> {
    await this.oddButtonParserSet.deactivateOdds();
    await this.webpage.disconnect();
  }

  public get page(): Page {
    return this.webpage.page;
  }

  public get exchange(): Exchange {
    return this.dbExchangeInitializer.exchange;
  }

  public get league(): League {
    return this.dbLeagueInitializer.league;
  }

  private set dbExchangeInitializer(dbExchangeInitializer: DbExchangeInitializer) {
    this.wrappedDbExchangeInitializer = dbExchangeInitializer;
  }

  private get dbExchangeInitializer(): DbExchangeInitializer {
    if (!this.wrappedDbExchangeInitializer) {
      throw new Error(`wrappedDbExchangeInitializer is undefined.`);
    }

    return this.wrappedDbExchangeInitializer;
  }

  private set dbLeagueInitializer(dbLeagueInitializer: DbLeagueInitializer) {
    this.wrappedDbLeagueInitializer = dbLeagueInitializer;
  }

  private get dbLeagueInitializer(): DbLeagueInitializer {
    if (!this.wrappedDbLeagueInitializer) {
      throw new Error(`wrappedDbLeagueInitializer is undefined.`);
    }

    return this.wrappedDbLeagueInitializer;
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