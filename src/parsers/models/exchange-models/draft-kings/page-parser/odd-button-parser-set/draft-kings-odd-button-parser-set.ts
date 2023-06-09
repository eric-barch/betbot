import * as p from 'puppeteer';

import { DraftKingsOddButtonParser, OddButtonParser, PageParser } from '@/parsers';
import { OddButtonParserSet } from '@/parsers/models/shared-models/page-parser/odd-button-parser-set/odd-button-parser-set';

export class DraftKingsOddButtonParserSet extends OddButtonParserSet {
  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser;
  }): Promise<DraftKingsOddButtonParserSet> {
    const draftKingsOddButtonParserSet = new DraftKingsOddButtonParserSet({ parentPageParser });
    await draftKingsOddButtonParserSet.init();
    return draftKingsOddButtonParserSet;
  }

  protected async updateButtonElements(): Promise<Array<p.ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttonElements = await page.$$('div[role="button"].sportsbook-outcome-cell__body');
    return this.buttonElements;
  }

  protected async initOddButtonParsers(): Promise<Set<OddButtonParser>> {
    for (const buttonElement of this.buttonElements) {
      const draftKingsOddButtonParser = await DraftKingsOddButtonParser.create({
        parentPageParser: this.parentPageParser,
        buttonElement,
      });

      this.oddButtonParsers.add(draftKingsOddButtonParser);
    }

    return this.oddButtonParsers;
  }
}