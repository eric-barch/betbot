import { Page } from 'puppeteer';
import { Exchange, League } from '@prisma/client';

import { PageParserInitData } from '@/setup';

import { DbExchangeInitializer, DbLeagueInitializer } from './db-initializers';
import { OddButtonParsers } from './odd-button-parsers';
import { Webpage } from './webpage';

export abstract class PageParser {
  private readonly initData: PageParserInitData;
  private wrappedWebpage: Webpage | undefined;
  private wrappedDbExchangeInitializer: DbExchangeInitializer | undefined;
  private wrappedDbLeagueInitializer: DbLeagueInitializer | undefined;
  private wrappedOddButtonParsers: OddButtonParsers | undefined;

  protected constructor({
    initData,
  }: {
    initData: PageParserInitData,
  }) {
    this.initData = initData;
  }

  protected async init(): Promise<PageParser> {
    this.webpage = await Webpage.create({ url: this.initData.url });
    this.dbExchangeInitializer = await DbExchangeInitializer.create({ initData: this.initData.exchangeInitData });
    this.dbLeagueInitializer = await DbLeagueInitializer.create({ initData: this.initData.leagueInitData });
    this.oddButtonParsers = await this.createOddButtonParsers();
    return this;
  }

  protected abstract createOddButtonParsers(): Promise<OddButtonParsers>;

  public async updateOdds(): Promise<PageParser> {
    await this.oddButtonParsers.updateOdds();
    return this;
  };

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

  protected set oddButtonParsers(oddButtonParsers: OddButtonParsers) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  protected get oddButtonParsers(): OddButtonParsers {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
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