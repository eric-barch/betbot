import { ElementHandle } from 'puppeteer';

import { OddButton } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/odd-button/odd-button';
import { OddButtonParser } from '@/parsers/models/shared-models';

export class FanDuelOddButton extends OddButton {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<FanDuelOddButton> {
    const fanDuelOddButton = new FanDuelOddButton({ button: parentOddButtonParser.seedButton });
    await fanDuelOddButton.init();
    return fanDuelOddButton;
  }

  protected async initReferenceSelector(): Promise<string> {
    this.referenceSelector = 'li';
    return this.referenceSelector;
  }
}