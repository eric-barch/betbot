import { Page } from 'puppeteer';

import { PageParserInitData } from '@/setup';
import { Exchange, League } from '@prisma/client';
import { DbExchange as ExchangeInitializer, DbLeague as LeagueInitializer } from './db-connections';
import { OddButtonParsers } from './odd-button-parsers';
import { Webpage } from './webpage';

export abstract class PageParser {
  private readonly initData: PageParserInitData;
  private wrappedWebpage: Webpage | undefined;
  private wrappedExchangeInitializer: ExchangeInitializer | undefined;
  private wrappedLeagueInitializer: LeagueInitializer | undefined;
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
    this.exchangeInitializer = await ExchangeInitializer.create({ initData: this.initData.exchangeInitData });
    this.leagueInitializer = await LeagueInitializer.create({ initData: this.initData.leagueInitData });
    this.oddButtonParsers = await this.createOddButtonParsers();
    return this;
  }

  protected abstract createOddButtonParsers(): Promise<OddButtonParsers>;

  public async updateOddData(): Promise<PageParser> {
    await this.oddButtonParsers.updateOddData();
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

  private set exchangeInitializer(exchangeInitializer: ExchangeInitializer) {
    this.wrappedExchangeInitializer = exchangeInitializer;
  }

  private set leagueInitializer(leagueInitializer: LeagueInitializer) {
    this.wrappedLeagueInitializer = leagueInitializer;
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
    return this.exchangeInitializer.exchange;
  }

  public get league(): League {
    return this.leagueInitializer.league
  }
}