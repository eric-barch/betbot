import { Odd } from '@prisma/client';

import { prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';

export class DbOddConnection {
  private readonly parentOddButtonParser: OddButtonParser;
  private wrappedOdd: Odd | undefined;

  private constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DbOddConnection> {
    const dbOddConnection = new DbOddConnection({
      parentOddButtonParser,
    });
    await dbOddConnection.init();
    return dbOddConnection;
  }

  private async init(): Promise<DbOddConnection> {
    this.odd = await this.findOrCreateOdd();
    return this;
  }

  private async findOrCreateOdd(): Promise<Odd> {
    const exchangeId = this.parentOddButtonParser.exchange.id;
    const statisticId = this.parentOddButtonParser.statistic.id;

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