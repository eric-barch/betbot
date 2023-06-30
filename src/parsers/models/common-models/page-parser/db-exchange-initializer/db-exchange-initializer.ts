import { Exchange } from '@prisma/client';

import { prisma } from '@/db';
import { PageParser } from '@/parsers/models/common-models';
import { draftKingsInitData, ExchangeInitData, fanDuelInitData, sugarHouseInitData } from '@/setup';


export class DbExchangeInitializer {
  private readonly pageUrl: string;
  private wrappedExchange: Exchange | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.pageUrl = parentPageParser.pageUrl;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<DbExchangeInitializer> {
    const dbExchangeInitializer = new DbExchangeInitializer({ parentPageParser });
    await dbExchangeInitializer.init();
    return dbExchangeInitializer;
  }

  private async init(): Promise<DbExchangeInitializer> {
    this.exchange = await this.findOrCreateExchangeFromPageUrl();
    return this;
  }

  private async findOrCreateExchangeFromPageUrl(): Promise<Exchange> {
    if (this.pageUrl.includes('draftkings.com')) {
      return await this.findOrCreateExchangeFromInitData({ exchangeInitData: draftKingsInitData });
    }

    if (this.pageUrl.includes('fanduel.com')) {
      return await this.findOrCreateExchangeFromInitData({ exchangeInitData: fanDuelInitData });
    }

    if (this.pageUrl.includes('playsugarhouse.com')) {
      return await this.findOrCreateExchangeFromInitData({ exchangeInitData: sugarHouseInitData });
    }

    throw new Error(`No exchange found for pageUrl: ${this.pageUrl}`);
  }

  private async findOrCreateExchangeFromInitData({
    exchangeInitData,
  }: {
    exchangeInitData: ExchangeInitData,
  }): Promise<Exchange> {
    return await prisma.exchange.upsert({
      where: {
        name: exchangeInitData.name,
      },
      update: {},
      create: {
        name: exchangeInitData.name,
      },
    });
  }

  public get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }

  private set exchange(exchange: Exchange) {
    this.wrappedExchange = exchange;
  }
}