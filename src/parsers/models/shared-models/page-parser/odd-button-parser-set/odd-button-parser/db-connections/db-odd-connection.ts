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