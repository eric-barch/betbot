import { ActiveModels } from '../active-models';
import { Exchange } from '@prisma/client';
import { exchangesData } from './exchange-data';
import { prisma } from '../..';

class ActiveExchanges extends ActiveModels<Exchange> {
  protected async initActiveModels(): Promise<Array<Exchange>> {
    const exchanges = new Array<Exchange>;

    for (const exchangeData of exchangesData) {
      let exchange: Exchange;

      try {
        exchange = await prisma.exchange.findFirstOrThrow({
          where: {
            name: exchangeData.name,
          },
        });
      } catch (e) {
        exchange = await prisma.exchange.create({
          data: {
            name: exchangeData.name,
          }
        })
      }

      exchanges.push(exchange);
    }

    return exchanges;
  }
}

export const activeExchanges = new ActiveExchanges();
