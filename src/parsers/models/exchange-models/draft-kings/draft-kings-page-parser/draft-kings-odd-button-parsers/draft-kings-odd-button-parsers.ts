import { DraftKingsOddButtonParser, DraftKingsPageParser } from '@/parsers/models/exchange-models/draft-kings';
import { OddButtonParser } from '@/parsers/models/shared-models';
import { OddButtonParsers } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parsers';

export class DraftKingsOddButtonParsers extends OddButtonParsers {
  public static async create({
    parentPageParser,
  }: {
    parentPageParser: DraftKingsPageParser;
  }): Promise<DraftKingsOddButtonParsers> {
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParsers({ parentPageParser });
    await draftKingsOddButtonParserSet.init();
    return draftKingsOddButtonParserSet;
  }

  protected async setOddButtonSelector(): Promise<string> {
    this.oddButtonSelector = 'div[role="button"].sportsbook-outcome-cell__body';
    return this.oddButtonSelector;
  }

  protected async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    // Run in series (development)
    for (const button of this.buttons) {
      const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
        exchange: this.parentPageParser.exchange,
        league: this.parentPageParser.league,
        button: button,
      });
      this.oddButtonParsers.add(draftKingsOddButtonParser);
    }

    // Run in parallel (production)
    // await Promise.all(
    //   this.buttons.map(async (button) => {
    //     const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
    //       exchange: this.parentPageParser.exchange,
    //       league: this.parentPageParser.league,
    //       button: button,
    //     });
    //     this.oddButtonParsers.add(draftKingsOddButtonParser);
    //   })
    // );

    return this.oddButtonParsers;
  }
}