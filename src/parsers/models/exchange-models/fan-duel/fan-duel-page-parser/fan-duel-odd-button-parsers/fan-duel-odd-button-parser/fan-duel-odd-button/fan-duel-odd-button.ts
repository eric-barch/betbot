import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/common-models';
import { OddButtonWrapper } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button/odd-button';

export class FanDuelOddButton extends OddButtonWrapper {
  public static async create({
    parentOddButtonParser,
    button,
  }: {
    parentOddButtonParser: OddButtonParser,
    button: ElementHandle,
  }): Promise<FanDuelOddButton> {
    const fanDuelOddButton = new FanDuelOddButton({
      parentOddButtonParser,
      button,
    });
    await fanDuelOddButton.init();
    return fanDuelOddButton;
  }

  protected async initReferenceSelector(): Promise<string> {
    this.referenceSelector = 'li';
    return this.referenceSelector;
  }
}