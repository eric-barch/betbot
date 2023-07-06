import { OddButtonParserSet } from '@/parsers/models/common-models';
import {
  SpecializedOddButtonParserSet
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser-set';

export class DraftKingsOddButtonParserSet extends SpecializedOddButtonParserSet {
  public static async create({
    parent,
  }: {
    parent: OddButtonParserSet,
  }): Promise<DraftKingsOddButtonParserSet> {
    const draftKingsOddButtonParser = new DraftKingsOddButtonParserSet({ parent });
    await draftKingsOddButtonParser.init();
    return draftKingsOddButtonParser;
  }

  public async generateOddButtonSelector(): Promise<string> {
    return 'div.sportsbook-outcome-cell__body, div.sportsbook-empty-cell.body';
  }
}