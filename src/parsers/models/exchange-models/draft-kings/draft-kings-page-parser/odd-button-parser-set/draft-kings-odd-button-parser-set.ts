import { PageParser } from '@/parsers/models/common-models';
import { CommonOddButtonParserSet, SpecializedOddButtonParserSet } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser-set';

export class DraftKingsOddButtonParserSet implements SpecializedOddButtonParserSet {
  private readonly parentPageParser: PageParser;
  private wrappedCommonOddButtonParserSet: CommonOddButtonParserSet | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<DraftKingsOddButtonParserSet> {
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParserSet({ parentPageParser });
    await draftKingsOddButtonParserSet.init();
    return draftKingsOddButtonParserSet;
  }

  private async init() {
    this.commonOddButtonParserSet = await CommonOddButtonParserSet.create({
      parentPageParser: this.parentPageParser,
      specializedOddButtonParserSet: this,
    });
  }

  public async generateOddButtonSelector(): Promise<string> {
    return 'div[role="button"].sportsbook-outcome-cell__body';
  }

  public async updateOdds(): Promise<void> {
    await this.commonOddButtonParserSet.updateOdds();
  }

  private set commonOddButtonParserSet(commonOddButtonParserSet: CommonOddButtonParserSet) {
    this.wrappedCommonOddButtonParserSet = commonOddButtonParserSet;
  }

  private get commonOddButtonParserSet(): CommonOddButtonParserSet {
    if (!this.wrappedCommonOddButtonParserSet) {
      throw new Error(`wrappedCommonOddButtonParserSet is undefined.`);
    }

    return this.wrappedCommonOddButtonParserSet;
  }
}