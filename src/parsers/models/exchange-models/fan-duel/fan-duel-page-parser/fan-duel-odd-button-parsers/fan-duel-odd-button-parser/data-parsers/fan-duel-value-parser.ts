import { OddButtonParser } from '@/parsers/models/shared-models';
import { DataParser } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/data-parser/data-parser';

export class FanDuelValueParser extends DataParser {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<FanDuelValueParser> {
    const fanDuelValueParser = new FanDuelValueParser({ parentOddButtonParser });
    await fanDuelValueParser.init();
    return fanDuelValueParser;
  }

  protected async initSelector(): Promise<string> {
    const spans = await this.parentOddButtonParser.button.$$('span');

    if (spans.length > 2) {
      this.selector = '';
      return this.selector;
    }

    const valueSpan = spans[0];
    const valueSpanClass = await (await valueSpan.getProperty('className')).jsonValue();

    this.selector = `.${valueSpanClass.replace(/ /g, '.')}`;
    return this.selector;
  }
}