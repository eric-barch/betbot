import { ElementHandle } from 'puppeteer';

import { OddButton } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/odd-button/odd-button';
import { OddButtonParser } from '@/parsers/models/shared-models';

export class DraftKingsOddButton extends OddButton {
  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DraftKingsOddButton> {
    const draftKingsOddButton = new DraftKingsOddButton({ parentOddButtonParser });
    await draftKingsOddButton.init();
    return draftKingsOddButton;
  }

  protected async initReferenceSelector(): Promise<string> {
    this.referenceSelector = 'tr';
    return this.referenceSelector;
  }
}