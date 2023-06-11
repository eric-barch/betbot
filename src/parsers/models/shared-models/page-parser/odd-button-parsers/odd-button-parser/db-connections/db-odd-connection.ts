import { prisma } from '@/db';
import { Odd } from '@prisma/client';

export abstract class DbOdd {
  private wrappedOdd: Odd | undefined;

  protected async init(): Promise<DbOdd> {
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