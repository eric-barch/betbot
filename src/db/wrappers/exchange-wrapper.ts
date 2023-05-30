import { prisma } from '@/db';
import { ExchangeInitData } from '@/init-data';
import { Exchange } from '@prisma/client';

export class ExchangeWrapper {
  private wrappedExchangeInitData: ExchangeInitData;
  private wrappedExchange: Exchange | undefined;

  constructor({
    exchangeInitData,
  }: {
    exchangeInitData: ExchangeInitData,
  }) {
    this.wrappedExchangeInitData = exchangeInitData;
  }

  public async connectDbModel(): Promise<Exchange> {
    let exchange: Exchange;

    try {
      exchange = await prisma.exchange.findFirstOrThrow({
        where: {
          name: this.wrappedExchangeInitData.name,
        },
      });
    } catch (e) {
      exchange = await prisma.exchange.create({
        data: {
          name: this.wrappedExchangeInitData.name,
        }
      })
    }

    this.wrappedExchange = exchange;

    return exchange;
  }

  get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }
}