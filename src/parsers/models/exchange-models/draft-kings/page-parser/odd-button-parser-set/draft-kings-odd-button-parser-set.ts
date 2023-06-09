import * as p from 'puppeteer';

import { DraftKingsOddButtonParser, DraftKingsPageParser, OddButtonParser } from '@/parsers';
import { OddButtonParserSet } from '@/parsers/models/shared-models/page-parser/odd-button-parser-set/odd-button-parser-set';

export class DraftKingsOddButtonParserSet extends OddButtonParserSet {
  public static async create({
    parentPageParser,
  }: {
    parentPageParser: DraftKingsPageParser;
  }): Promise<DraftKingsOddButtonParserSet> {
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParserSet({ parentPageParser });
    await draftKingsOddButtonParserSet.init();
    return draftKingsOddButtonParserSet;
  }

  protected async scrapePageForButtons(): Promise<Array<p.ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttons = await page.$$('div[role="button"].sportsbook-outcome-cell__body');
    return this.buttons;
  }

  protected async initOddButtonParsers(): Promise<Set<OddButtonParser>> {
    for (const buttonElement of this.buttons) {
      const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
        parentPageParser: this.parentPageParser,
        button: buttonElement,
      });

      this.add(draftKingsOddButtonParser);
    }

    return this;
  }
}