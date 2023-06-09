import * as p from 'puppeteer';

import { PageParserInitData } from '@/setup';
import { Exchange, League } from '@prisma/client';
import { DbExchange, DbLeague } from './db-connections';
import { OddButtonParsers } from './odd-button-parsers';
import { Webpage } from './webpage';

export abstract class PageParser {
  private initData: PageParserInitData;
  private wrappedWebpage: Webpage | undefined;
  private wrappedDbExchange: DbExchange | undefined;
  private wrappedDbLeague: DbLeague | undefined;
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
    this.dbExchange = await DbExchange.create({ initData: this.initData.exchangeInitData });
    this.dbLeague = await DbLeague.create({ initData: this.initData.leagueInitData });
    this.oddButtonParsers = await this.initOddButtonParsers();
    return this;
  }

  protected abstract initOddButtonParsers(): Promise<OddButtonParsers>;

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

  private set dbExchange(dbExchange: DbExchange) {
    this.wrappedDbExchange = dbExchange;
  }

  private get dbExchange(): DbExchange {
    if (!this.wrappedDbExchange) {
      throw new Error(`wrappedDbExchange is undefined.`);
    }

    return this.wrappedDbExchange;
  }

  private set dbLeague(dbLeague: DbLeague) {
    this.wrappedDbLeague = dbLeague;
  }

  private get dbLeague(): DbLeague {
    if (!this.wrappedDbLeague) {
      throw new Error(`wrappedDbLeague is undefined.`);
    }

    return this.wrappedDbLeague;
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

  public get page(): p.Page {
    return this.webpage.page;
  }

  public get exchange(): Exchange {
    return this.dbExchange.exchange;
  }

  public get league(): League {
    return this.dbLeague.league
  }
}