import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/common-models';
import {
  OddButtonWrapper,
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-wrapper/odd-button-wrapper';

export class FanDuelOddButtonWrapper extends OddButtonWrapper {
  public static async create({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<FanDuelOddButtonWrapper> {
    const fanDuelOddButtonWrapper = new FanDuelOddButtonWrapper({
      parent,
      oddButton,
    });
    await fanDuelOddButtonWrapper.init();
    return fanDuelOddButtonWrapper;
  }

  protected async generateReferenceSelector(): Promise<string> {
    this.referenceSelector = 'li';
    return this.referenceSelector;
  }

  /**TODO: Not sure this does anything for FanDuel and not sure it should be included as a step in
   * the common OddButtonWrapper. Might want to specify to DraftKings.  */
  /**TODO: Never check for undefined using !. Explicitly test whether foo === undefined */
  protected async verifyOddButtonPosition(): Promise<boolean> {
    return true;
  }
}