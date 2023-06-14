import { OddButtonParser } from '@/parsers/models/shared-models';
import { DataParser } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/data-parser/data-parser';

export class FanDuelPriceParser extends DataParser {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<FanDuelPriceParser> {
    const fanDuelPriceParser = new FanDuelPriceParser({ parentOddButtonParser });
    await fanDuelPriceParser.init();
    return fanDuelPriceParser;
  }

  protected async initSelector(): Promise<string | null> {
    const spans = await this.parentOddButtonParser.button.$$('span');

    if (spans.length !== 2) {
      this.selector = null;
      return this.selector;
    }

    const priceSpan = spans[1];
    const priceSpanClass = await (await priceSpan.getProperty('className')).jsonValue();

    this.selector = `.${priceSpanClass.replace(/ /g, '.')}`;
    return this.selector;
  }
}