import * as p from 'puppeteer';

import { DraftKingsOddButtonParser, DraftKingsPageParser, OddButtonParser } from '@/parsers';
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

  protected async scrapeButtons(): Promise<Array<p.ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttons = await page.$$('div[role="button"].sportsbook-outcome-cell__body');
    return this.buttons;
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