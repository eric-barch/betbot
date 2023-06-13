import { Odd } from '@prisma/client';

import { prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/shared-models';

export abstract class DbOddInitializer {
  protected readonly parentOddButtonParser: OddButtonParser;
  private wrappedOdd: Odd | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DbOddInitializer> {
    this.odd = await this.updateDbOdd();
    return this;
  }

  protected abstract updateDbOdd(): Promise<Odd>;

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

  protected set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }

  public get odd(): Odd {
    if (!this.wrappedOdd) {
      throw new Error(`wrappedOdd is undefined.`);
    }

    return this.wrappedOdd;
  }
}