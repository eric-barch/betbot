import { ElementHandle } from 'puppeteer';

import { OddButtonWrapper } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-wrapper/odd-button-wrapper';
import { OddButtonParser } from '@/parsers/models/common-models';

export class DraftKingsOddButton extends OddButtonWrapper {
  public static async create({
    parentOddButtonParser,
    button,
  }: {
    parentOddButtonParser: OddButtonParser,
    button: ElementHandle,
  }): Promise<DraftKingsOddButton> {
    const draftKingsOddButton = new DraftKingsOddButton({
      parentOddButtonParser,
      button,
    });
    await draftKingsOddButton.init();
    return draftKingsOddButton;
  }

  protected async initReferenceSelector(): Promise<string> {
    this.referenceSelector = 'tr';
    return this.referenceSelector;
  }
}