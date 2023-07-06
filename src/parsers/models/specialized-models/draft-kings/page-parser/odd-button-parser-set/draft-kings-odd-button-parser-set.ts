import { PageParser } from '@/parsers/models/common-models';
import {
  OddButtonParserSet
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser-set';

export class DraftKingsOddButtonParserSet extends OddButtonParserSet {
  public static async create({
    parent,
  }: {
    parent: PageParser,
  }): Promise<DraftKingsOddButtonParserSet> {
    const draftKingsOddButtonParser = new DraftKingsOddButtonParserSet({ parent });
    await draftKingsOddButtonParser.init();
    return draftKingsOddButtonParser;
  }

  public async generateOddButtonSelector(): Promise<string> {
    this.oddButtonSelector = 'div.sportsbook-outcome-cell__body, div.sportsbook-empty-cell.body';
    return this.oddButtonSelector;
  }
}