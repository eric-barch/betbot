import { SpecializedOddButtonParserSet } from '@/parsers/models/common-models';

export class DraftKingsOddButtonParserSet implements SpecializedOddButtonParserSet {
  public async generateOddButtonSelector(): Promise<string> {
    return 'div[role="button"].sportsbook-outcome-cell__body';
  }
}