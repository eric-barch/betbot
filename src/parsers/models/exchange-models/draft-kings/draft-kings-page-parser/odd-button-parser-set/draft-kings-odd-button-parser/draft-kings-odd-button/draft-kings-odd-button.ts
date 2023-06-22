import { ElementHandle } from 'puppeteer';

import { OddButton } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button/odd-button';
import { CommonOddButtonParser } from '@/parsers/models/common-models';

export class DraftKingsOddButton extends OddButton {
  public static async create({
    parentOddButtonParser,
    button,
  }: {
    parentOddButtonParser: CommonOddButtonParser,
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