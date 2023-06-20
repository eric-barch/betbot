import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { PageParserInitData } from '@/setup';

import { DbExchangeInitializer, DbLeagueInitializer } from './db-initializers';
import { IOddButtonParserSet } from './odd-button-parsers';
import { Webpage } from './webpage';

export interface IPageParser {
  page: Page;
  exchange: Exchange;
  league: League;
  oddButtonParserSet: IOddButtonParserSet;
  updateOdds(): Promise<void>;
  disconnect(): Promise<void>;
}

export class PageParser {
  private readonly initData: PageParserInitData;
  private wrappedWebpage: Webpage | undefined;
  private wrappedDbExchangeInitializer: DbExchangeInitializer | undefined;
  private wrappedDbLeagueInitializer: DbLeagueInitializer | undefined;

  private constructor({
    initData,
  }: {
    initData: PageParserInitData,
  }) {
    this.initData = initData;
  }

  public static async create({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<PageParser> {
    const pageParser = new PageParser({ initData });

    pageParser.webpage = await Webpage.create({
      url: pageParser.initData.url
    });
    pageParser.dbExchangeInitializer = await DbExchangeInitializer.create({
      initData: pageParser.initData.exchangeInitData
    });
    pageParser.dbLeagueInitializer = await DbLeagueInitializer.create({
      initData: pageParser.initData.leagueInitData
    });

    return pageParser;
  }

  public async disconnect(): Promise<void> {
    await this.webpage.disconnect();
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

  public get page(): Page {
    return this.webpage.page;
  }

  public get exchange(): Exchange {
    return this.dbExchangeInitializer.exchange;
  }

  public get league(): League {
    return this.dbLeagueInitializer.league
  }
}