import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { PageParserInitData } from '@/setup';

import { IParserFactory } from '../i-parser-factory';

import { DbExchangeInitializer, DbLeagueInitializer } from './db-initializers';
import { IJsonGamesParser } from './json-games-parser/json-games-parser';
import { IOddButtonParserSet } from './odd-button-parser-set';
import { Webpage } from './webpage';

export class PageParser {
  private readonly initData: PageParserInitData;
  public readonly parserFactory: IParserFactory;
  private wrappedWebpage: Webpage | undefined;
  private wrappedDbExchangeInitializer: DbExchangeInitializer | undefined;
  private wrappedDbLeagueInitializer: DbLeagueInitializer | undefined;
  private wrappedJsonGamesParser: IJsonGamesParser | undefined;
  private wrappedOddButtonParserSet: IOddButtonParserSet | undefined;

  private constructor({
    initData,
    parserFactory,
  }: {
    initData: PageParserInitData,
    parserFactory: IParserFactory,
  }) {
    this.initData = initData;
    this.parserFactory = parserFactory;
  }

  public static async create({
    initData,
    parserFactory,
  }: {
    initData: PageParserInitData,
    parserFactory: IParserFactory,
  }): Promise<PageParser> {
    const pageParser = new PageParser({
      initData,
      parserFactory,
    });

    pageParser.webpage = await Webpage.create({
      url: pageParser.initData.url
    });
    pageParser.dbExchangeInitializer = await DbExchangeInitializer.create({
      initData: pageParser.initData.exchangeInitData
    });
    pageParser.dbLeagueInitializer = await DbLeagueInitializer.create({
      initData: pageParser.initData.leagueInitData
    });
    pageParser.jsonGamesParser = await pageParser.parserFactory.createJsonGamesParser({
      parentPageParser: pageParser,
    });
    pageParser.oddButtonParserSet = await pageParser.parserFactory.createOddButtonParserSet({
      parentPageParser: pageParser,
    });

    return pageParser;
  }

  public async updateOdds(): Promise<void> {
    await this.oddButtonParserSet.updateOdds();
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

  private set jsonGamesParser(jsonGamesParser: IJsonGamesParser) {
    this.wrappedJsonGamesParser = jsonGamesParser;
  }

  private get jsonGamesParser(): IJsonGamesParser {
    if (!this.wrappedJsonGamesParser) {
      throw new Error(`wrappedJsonGamesParser is undefined.`);
    }

    return this.wrappedJsonGamesParser;
  }

  private set oddButtonParserSet(oddButtonParserSet: IOddButtonParserSet) {
    this.wrappedOddButtonParserSet = oddButtonParserSet;
  }

  public get oddButtonParserSet(): IOddButtonParserSet {
    if (!this.wrappedOddButtonParserSet) {
      throw new Error(`wrappedOddButtonParserSet is undefined.`);
    }

    return this.wrappedOddButtonParserSet;
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