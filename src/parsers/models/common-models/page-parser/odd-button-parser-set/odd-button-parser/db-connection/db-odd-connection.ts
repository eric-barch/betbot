import { Odd, Statistic } from '@prisma/client';

import { prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';

export class DbOddConnection {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly statistic: Statistic;
  private wrappedOdd: Odd | undefined;

  private constructor({
    parentOddButtonParser,
    statistic,
  }: {
    parentOddButtonParser: OddButtonParser,
    statistic: Statistic,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.statistic = statistic;
  }

  public static async create({
    parentOddButtonParser,
    statistic,
  }: {
    parentOddButtonParser: OddButtonParser,
    statistic: Statistic,
  }): Promise<DbOddConnection> {
    const dbOddConnection = new DbOddConnection({
      parentOddButtonParser,
      statistic,
    });
    await dbOddConnection.init();
    return dbOddConnection;
  }

  private async init(): Promise<DbOddConnection> {
    this.odd = await this.findOrCreateOdd();
    return this;
  }

  private async findOrCreateOdd(): Promise<Odd> {
    const exchangeId = this.parentOddButtonParser.parent.exchange.id;
    const statisticId = this.statistic.id;

    this.odd = await prisma.odd.upsert({
      where: {
        exchangeId_statisticId: {
          exchangeId,
          statisticId,
        },
      },
      update: {
        isVisible: true,
      },
      create: {
        exchangeId,
        statisticId,
        isVisible: true,
      },
    });

    return this.odd;
  }

  public async update({
    price,
    value,
  }: {
    price: number | null,
    value: number | null,
  }): Promise<Odd> {
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

  public async disconnect(): Promise<Odd> {
    this.odd = await prisma.odd.update({
      where: {
        id: this.odd.id,
      },
      data: {
        price: null,
        value: null,
        isVisible: false,
      }
    });

    return this.odd;
  }

  private set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }

  public get odd(): Odd {
    if (this.wrappedOdd === undefined) {
      throw new Error(`wrappedOdd is undefined.`);
    }

    return this.wrappedOdd;
  }
}