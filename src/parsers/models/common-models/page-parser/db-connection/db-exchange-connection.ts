import { Exchange } from '@prisma/client';

import { prisma } from '@/db';
import { PageParser } from '@/parsers/models/common-models';
import { draftKingsInitData, ExchangeInitData, fanDuelInitData, sugarHouseInitData } from '@/setup';


export class DbExchangeConnection {
  private readonly parentPageParser: PageParser;
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
    await dbExchangeConnection.init();
    return dbExchangeConnection;
  }

  private async init(): Promise<DbExchangeConnection> {
    this.exchange = await this.findOrCreateExchangeFromPageUrl();
    return this;
  }

  private async findOrCreateExchangeFromPageUrl(): Promise<Exchange> {
    const pageUrl = this.parentPageParser.pageUrl;

    if (pageUrl.includes('draftkings.com')) {
      return await this.findOrCreateExchangeFromInitData({ exchangeInitData: draftKingsInitData });
    }

    if (pageUrl.includes('fanduel.com')) {
      return await this.findOrCreateExchangeFromInitData({ exchangeInitData: fanDuelInitData });
    }

    if (pageUrl.includes('playsugarhouse.com')) {
      return await this.findOrCreateExchangeFromInitData({ exchangeInitData: sugarHouseInitData });
    }

    throw new Error(`No exchange found for pageUrl: ${pageUrl}`);
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