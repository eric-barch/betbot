import { ElementHandle } from 'puppeteer';

import { DraftKingsOddButtonParser, DraftKingsPageParser } from '@/parsers/models/exchange-models/draft-kings';
import { OddButtonParser, OddButtonParsers } from '@/parsers/models/shared-models';

export class DraftKingsOddButtonParsers extends OddButtonParsers {
  protected wrappedOddButtonSelector: string = 'div[role="button"].sportsbook-outcome-cell__body';

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: DraftKingsPageParser;
  }): Promise<DraftKingsOddButtonParsers> {
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParsers({ parentPageParser });
    await draftKingsOddButtonParserSet.init();
    return draftKingsOddButtonParserSet;
  }

  protected async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    for (const button of this.buttons) {
      const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
        exchange: this.parentPageParser.exchange,
        league: this.parentPageParser.league,
        button: button,
      });

      this.oddButtonParsers.add(draftKingsOddButtonParser);
    }

    return this.oddButtonParsers;
  }
}