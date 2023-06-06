import { OddHandleParser } from '../odd-handle-parser';
import { DataParser } from './data-parser';

export class ValueParser extends DataParser {
  protected selector: string;

  private constructor({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }) {
    super({ parentOddHandleParser });
    this.selector = '.sportsbook-outcome-cell__label-line-container'
  }

  public static async create({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }): Promise<ValueParser> {
    const priceParser = new ValueParser({ parentOddHandleParser });
    await priceParser.update();
    return priceParser;
  }
}