import { Exchange } from '@prisma/client';

import { prisma } from '@/db';
import { ExchangeInitData } from '@/setup';

export class DbExchangeInitializer {
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
  }): Promise<DbExchangeInitializer> {
    const dbExchangeInitializer = new DbExchangeInitializer({ initData });
    await dbExchangeInitializer.init();
    return dbExchangeInitializer;
  }

  private async init(): Promise<DbExchangeInitializer> {
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