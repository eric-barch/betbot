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
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParserSet({ parent });
    await draftKingsOddButtonParserSet.init();
    return draftKingsOddButtonParserSet;
  }

  public async generateOddButtonSelector(): Promise<string> {
    this.oddButtonSelector = 'div.sportsbook-outcome-cell__body, div.sportsbook-empty-cell.body';
    return this.oddButtonSelector;
  }
}