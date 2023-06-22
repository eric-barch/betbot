import { PageParser } from '@/parsers/models/common-models';
import { OddButtonParserSet, SpecializedOddButtonParserSet } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser-set';

export class DraftKingsOddButtonParserSet implements SpecializedOddButtonParserSet {
  private readonly parentPageParser: PageParser;
  private readonly parentOddButtonParserSet: OddButtonParserSet;

  public constructor({
    parentPageParser,
    parentOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParserSet: OddButtonParserSet,
  }) {
    this.parentPageParser = parentPageParser;
    this.parentOddButtonParserSet = parentOddButtonParserSet;
  }

  public async generateOddButtonSelector(): Promise<string> {
    return 'div[role="button"].sportsbook-outcome-cell__body';
  }

  public async updateOdds(): Promise<void> {
    await this.parentOddButtonParserSet.updateOddsForEachButtonParser();
  }
}