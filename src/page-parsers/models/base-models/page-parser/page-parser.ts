import { prisma } from '@/db';
import { PageParserInitializer } from './page-parser-initializer';
import { WebpageConnection } from './webpage-connection';
import { ExchangeInitData, LeagueInitData } from '@/init-data';
import { Exchange, League } from '@prisma/client';

export abstract class PageParser {
  private initializer: PageParserInitializer;
  private webpageConnection: WebpageConnection | undefined;
  private wrappedExchange: Exchange | undefined;
  private wrappedLeague: League | undefined;

  constructor({
    exchangeInitData,
    leagueInitData,
    url
  }: {
    exchangeInitData: ExchangeInitData,
    leagueInitData: LeagueInitData,
    url: string
  }) {
    this.initializer = new PageParserInitializer({
      pageParser: this,
      exchangeInitData,
      leagueInitData,
      url,
    });
  }

  protected async init(): Promise<PageParser> {
    this.webpageConnection = await this.initializer.initWebpageConnection();
    this.wrappedExchange = await this.initializer.initExchange();
    this.wrappedLeague = await this.initializer.initLeague();
    return this;
  }

  public get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }

  public get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}