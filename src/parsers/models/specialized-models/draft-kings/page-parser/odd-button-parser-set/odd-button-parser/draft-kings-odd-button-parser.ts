import {
  OddButtonParser, PageParser, SpecializedOddButtonParser,
} from '@/parsers/models/common-models';

export class DraftKingsOddButtonParser implements SpecializedOddButtonParser {
  private readonly parentPageParser: PageParser;
  private readonly parentOddButtonParser: OddButtonParser;

  public constructor({
    parentPageParser,
    parentOddButtonParser,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public async updateOdd(): Promise<void> {
    await this.parentOddButtonParser.resetOddButtonFromReference();
    await this.parentOddButtonParser.updateDbOddFromOddButtonTextContent();
  }
}