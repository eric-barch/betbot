import { DbUtilityFunctions } from '@/db';
import { Exchange } from '@prisma/client';
import { PageParser } from '../page-parser';

export class DbExchangeConnection {
  private parentPageParser: PageParser;
  private wrappedExchange: Exchange | undefined;

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
  }): Promise<DbExchangeConnection> {
    const dbExchangeConnection = new DbExchangeConnection({ parentPageParser });
    await dbExchangeConnection.connect();
    return dbExchangeConnection;
  }

  private async connect(): Promise<DbExchangeConnection> {
    this.exchange = await DbUtilityFunctions.findExchangeByName({ name: this.parentPageParser.exchangeName });
    return this;
  }

  private set exchange(exchange: Exchange) {
    this.wrappedExchange = exchange;
  }

  public get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }
}