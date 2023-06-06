import { DbUtilityFunctions, prisma } from '@/db';
import { Odd } from '@prisma/client';
import { OddHandleParser } from '../odd-handle-parser';

export class OddLinker {
  private parentOddHandleParser: OddHandleParser;
  private wrappedOdd: Odd | undefined;

  private constructor({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }) {
    this.parentOddHandleParser = parentOddHandleParser;
  }

  public static async create({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }): Promise<OddLinker> {
    const oddLinker = new OddLinker({ parentOddHandleParser });
    await oddLinker.link();
    return oddLinker;
  }

  private async link(): Promise<Odd> {
    const exchange = this.parentOddHandleParser.exchange;
    const statistic = this.parentOddHandleParser.statistic;

    this.odd = await DbUtilityFunctions.findOrCreateOddByExchangeAndStatistic({
      exchange,
      statistic,
    });

    return this.odd;
  }

  public async updateData(): Promise<Odd> {
    const price = this.parentOddHandleParser.price;
    const value = this.parentOddHandleParser.value;

    this.odd = await prisma.odd.update({
      where: {
        id: this.odd.id,
      },
      data: {
        price,
        value,
      }
    });

    return this.odd;
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