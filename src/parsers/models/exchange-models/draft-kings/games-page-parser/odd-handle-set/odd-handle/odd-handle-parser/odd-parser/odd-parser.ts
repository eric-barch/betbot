import { Exchange, Odd, Statistic } from '@prisma/client';
import { DbUtilityFunctions } from '@/db';
import { OddHandleParser } from '../odd-handle-parser';
import { OddHandle } from '../../odd-handle';

export class OddParser {
  private parentOddHandle: OddHandle;
  private wrappedOdd: Odd | undefined;

  constructor({
    parentOddHandle,
  }: {
    parentOddHandle: OddHandle,
  }) {
    this.parentOddHandle = parentOddHandle;
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
    return this.parentOddHandle.exchange;
  }

  private get statistic(): Statistic {
    return this.parentOddHandle.statistic;
  }

  private set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }

  public get odd(): Odd {
    if (!this.wrappedOdd) {
      throw new Error(`wrappedOdd is undefined.`);
    }

    return this.wrappedOdd;
  }
}