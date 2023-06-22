import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { PageParserInitData } from '@/setup';

import { ParserFactory } from '../parser-factory';

import { DbExchangeInitializer, DbLeagueInitializer } from './db-initializers';
import { SpecializedJsonGamesParser } from './json-games-parser/json-games-parser';
import { OddButtonParserSet } from './odd-button-parser-set';
import { Webpage } from './webpage';

export class PageParser {
  private readonly initData: PageParserInitData;
  private readonly parserFactory: ParserFactory;
  private wrappedWebpage: Webpage | undefined;
  private wrappedDbExchangeInitializer: DbExchangeInitializer | undefined;
  private wrappedDbLeagueInitializer: DbLeagueInitializer | undefined;
  private wrappedJsonGamesParser: SpecializedJsonGamesParser | undefined;
  private wrappedOddButtonParserSet: OddButtonParserSet | undefined;

  private constructor({
    initData,
    parserFactory,
  }: {
    initData: PageParserInitData,
    parserFactory: ParserFactory,
  }) {
    this.initData = initData;
    this.parserFactory = parserFactory;
  }

  public static async create({
    initData,
    parserFactory,
  }: {
    initData: PageParserInitData,
    parserFactory: ParserFactory,
  }): Promise<PageParser> {
    const pageParser = new PageParser({
      initData,
      parserFactory,
    });
    await pageParser.init();
    return pageParser;
  }

  private async init(): Promise<PageParser> {
    this.webpage = await Webpage.create({ url: this.initData.url });
    this.dbExchangeInitializer = await DbExchangeInitializer.create({ initData: this.initData.exchangeInitData });
    this.dbLeagueInitializer = await DbLeagueInitializer.create({ initData: this.initData.leagueInitData });
    this.jsonGamesParser = await this.parserFactory.createJsonGamesParser({ parentPageParser: this });
    this.oddButtonParserSet = await OddButtonParserSet.create({
      parentPageParser: this,
      parserFactory: this.parserFactory,
    });

    return this;
  }

  public async updateOdds(): Promise<void> {
    await this.oddButtonParserSet.updateOddsForEachButtonParser();
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

  private set jsonGamesParser(jsonGamesParser: SpecializedJsonGamesParser) {
    this.wrappedJsonGamesParser = jsonGamesParser;
  }

  private get jsonGamesParser(): SpecializedJsonGamesParser {
    if (!this.wrappedJsonGamesParser) {
      throw new Error(`wrappedJsonGamesParser is undefined.`);
    }

    return this.wrappedJsonGamesParser;
  }

  private set oddButtonParserSet(oddButtonParserSet: OddButtonParserSet) {
    this.wrappedOddButtonParserSet = oddButtonParserSet;
  }

  public get oddButtonParserSet(): OddButtonParserSet {
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