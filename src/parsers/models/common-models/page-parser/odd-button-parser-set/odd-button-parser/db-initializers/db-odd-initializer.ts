import { Odd } from '@prisma/client';

import { prisma } from '@/db';
import { CommonOddButtonParser } from '@/parsers/models/common-models';

export class DbOddInitializer {
  private readonly parentOddButtonParser: CommonOddButtonParser;
  private wrappedOdd: Odd | undefined;

  private constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: CommonOddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: CommonOddButtonParser,
  }): Promise<DbOddInitializer> {
    const dbOddInitializer = new DbOddInitializer({
      parentOddButtonParser,
    });
    await dbOddInitializer.init();
    return dbOddInitializer;
  }

  private async init(): Promise<DbOddInitializer> {
    this.odd = await this.updateDbOdd();
    return this;
  }

  private async updateDbOdd(): Promise<Odd> {
    const exchangeId = this.parentOddButtonParser.exchange.id;
    const statisticId = this.parentOddButtonParser.statistic.id;

    this.odd = await prisma.odd.upsert({
      where: {
        exchangeId_statisticId: {
          exchangeId,
          statisticId,
        },
      },
      update: {},
      create: {
        exchangeId,
        statisticId,
      },
    });

    return this.odd;
  }

  public async updateData({
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