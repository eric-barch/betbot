import { OddHandleParser } from '../odd-handle-parser';
import { DataParser } from './data-parser';

export class PriceParser extends DataParser {
  protected selector: string;

  private constructor({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }) {
    super({ parentOddHandleParser });
    this.selector = '.sportsbook-outcome-cell__elements';
  }

  public static async create({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }): Promise<PriceParser> {
    const priceParser = new PriceParser({ parentOddHandleParser });
    await priceParser.update();
    return priceParser;
  }
}