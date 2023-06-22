import { PageParser } from '@/parsers/models/common-models';
import { OddButtonParser, SpecializedOddButtonParser } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-parser';

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