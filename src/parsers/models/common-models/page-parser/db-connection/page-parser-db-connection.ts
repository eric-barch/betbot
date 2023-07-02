import { Exchange, League } from '@prisma/client';

import {
  PageParser, DbExchangeConnection, DbLeagueConnection
} from '@/parsers/models/common-models';

export class PageParserDbConnection {
  private readonly parentPageParser: PageParser;
  private wrappedDbExchangeConnection: DbExchangeConnection | undefined;
  private wrappedDbLeagueConnection: DbLeagueConnection | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<PageParserDbConnection> {
    const pageParserDbConnection = new PageParserDbConnection({ parentPageParser });
    await pageParserDbConnection.init();
    return pageParserDbConnection;
  }

  private async init(): Promise<PageParserDbConnection> {
    this.dbExchangeConnection = await DbExchangeConnection.create({
      parentPageParser: this.parentPageParser,
    });
    this.dbLeagueConnection = await DbLeagueConnection.create({
      parentPageParser: this.parentPageParser,
      exchange: this.exchange,
    });
    return this;
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
    if (this.wrappedDbExchangeConnection === undefined) {
      throw new Error('wrappedDbExchangeConnection is undefined.');
    }
    return this.wrappedDbExchangeConnection;
  }

  private set dbLeagueConnection(dbLeagueConnection: DbLeagueConnection) {
    this.wrappedDbLeagueConnection = dbLeagueConnection;
  }

  private get dbLeagueConnection(): DbLeagueConnection {
    if (this.wrappedDbLeagueConnection === undefined) {
      throw new Error('wrappedDbLeagueConnection is undefined.');
    }
    return this.wrappedDbLeagueConnection;
  }
}