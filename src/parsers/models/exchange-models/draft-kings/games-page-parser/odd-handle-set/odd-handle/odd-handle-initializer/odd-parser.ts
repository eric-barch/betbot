import { Exchange, Odd, Statistic } from '@prisma/client';
import { DbUtilityFunctions } from '@/db';
import { OddHandleInitializer } from './odd-handle-initializer';

export class OddParser {
  private parent: OddHandleInitializer;
  private wrappedOdd: Odd | undefined;

  constructor({
    parent,
  }: {
    parent: OddHandleInitializer,
  }) {
    this.parent = parent;
  }

  public async parse(): Promise<Odd> {
    const exchange = this.exchange;
    const statistic = this.statistic;

    this.odd = await DbUtilityFunctions.findOrCreateOddByExchangeAndStatistic({
      exchange,
      statistic,
    });

    return this.odd;
  }

  private get exchange(): Exchange {
    return this.parent.exchange;
  }

  private get statistic(): Statistic {
    return this.parent.statistic;
  }

  public get odd(): Odd {
    if (!this.wrappedOdd) {
      throw new Error(`wrappedOdd is undefined.`);
    }

    return this.wrappedOdd;
  }

  private set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }
}