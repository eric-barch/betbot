import { Exchange } from '@prisma/client';

import { prisma } from '@/db';
import { ExchangeInitData } from '@/setup';

export class DbExchange {
  private initData: ExchangeInitData;
  private wrappedExchange: Exchange | undefined;

  private constructor({
    initData,
  }: {
    initData: ExchangeInitData,
  }) {
    this.initData = initData;
  }

  public static async create({
    initData,
  }: {
    initData: ExchangeInitData,
  }): Promise<DbExchange> {
    const dbExchangeConnection = new DbExchange({ initData });
    await dbExchangeConnection.connect();
    return dbExchangeConnection;
  }

  private async connect(): Promise<DbExchange> {
    this.exchange = await prisma.exchange.findUniqueOrThrow({
      where: {
        name: this.initData.name,
      },
    });

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