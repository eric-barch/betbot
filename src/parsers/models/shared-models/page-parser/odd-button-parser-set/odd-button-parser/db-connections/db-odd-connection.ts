import { prisma } from '@/db';
import { Odd } from '@prisma/client';
import { OddButtonParser } from '../odd-button-parser';

export abstract class DbOddConnection {
  private wrappedParentOddButtonParser: OddButtonParser;
  private wrappedOdd: Odd | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.wrappedParentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DbOddConnection> {
    this.odd = await this.updateDbOdd();
    return this;
  }

  protected abstract updateDbOdd(): Promise<Odd>;

  public async updateData(): Promise<Odd> {
    const price = this.parentOddButtonParser.price;
    const value = this.parentOddButtonParser.value;

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

  protected get parentOddButtonParser(): OddButtonParser {
    return this.wrappedParentOddButtonParser;
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