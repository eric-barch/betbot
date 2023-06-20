import { IPageParser, OddButtonParser } from '@/parsers/models/common-models';
import { CommonOddButtonParserSet, IOddButtonParserSet } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser-set';
import { DraftKingsOddButtonParser } from '@/parsers/models/exchange-models/draft-kings';

export class DraftKingsOddButtonParserSet implements IOddButtonParserSet {
  private wrappedCommonOddButtonParserSet: CommonOddButtonParserSet | undefined;
  private wrappedOddButtonParsers: Set<DraftKingsOddButtonParser> | undefined;

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: IPageParser,
  }): Promise<DraftKingsOddButtonParserSet> {
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParserSet();

    draftKingsOddButtonParserSet.commonOddButtonParserSet = await CommonOddButtonParserSet.create({
      parentPageParser,
      parentOddButtonParserSet: draftKingsOddButtonParserSet,
    });

    draftKingsOddButtonParserSet.oddButtonParsers = await draftKingsOddButtonParserSet.createOddButtonParsers();

    return draftKingsOddButtonParserSet;
  }

  public async generateOddButtonSelector(): Promise<string> {
    return 'div[role="button"].sportsbook-outcome-cell__body';
  }

  public async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    this.oddButtonParsers = new Set<DraftKingsOddButtonParser>();

    // Run in series (development)
    for (const button of this.commonOddButtonParserSet.buttons) {
      const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
        exchange: this.commonOddButtonParserSet.exchange,
        league: this.commonOddButtonParserSet.league,
        button: button,
      });
      this.oddButtonParsers.add(draftKingsOddButtonParser);
    }

    // Run in parallel (production)
    // await Promise.all(
    //   this.buttons.map(async (button) => {
    //     const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
    //       exchange: this.commonOddButtonParserSet.exchange,
    //       league: this.commonOddButtonParserSet.league,
    //       button: button,
    //     });
    //     this.oddButtonParsers.add(draftKingsOddButtonParser);
    //   })
    // );

    return this.oddButtonParsers;
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

  private set oddButtonParsers(oddButtonParsers: Set<DraftKingsOddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  public get oddButtonParsers(): Set<DraftKingsOddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }
}