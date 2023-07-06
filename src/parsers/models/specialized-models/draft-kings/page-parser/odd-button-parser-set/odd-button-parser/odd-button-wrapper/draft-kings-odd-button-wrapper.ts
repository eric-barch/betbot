import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/common-models';
import {
  OddButtonWrapper,
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-wrapper/odd-button-wrapper';

export class DraftKingsOddButtonWrapper extends OddButtonWrapper {
  public static async create({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<DraftKingsOddButtonWrapper> {
    const draftKingsOddButtonWrapper = new DraftKingsOddButtonWrapper({
      parent,
      oddButton,
    });
    await draftKingsOddButtonWrapper.init();
    return draftKingsOddButtonWrapper;
  }

  protected async generateReferenceSelector(): Promise<string> {
    this.referenceSelector = 'tr';
    return this.referenceSelector;
  }

  protected async verifyOddButtonPosition(): Promise<boolean> {
    const game = this.parent.game;

    const awayTeamIdentifierFull = game.awayTeam.identifierFull.toLowerCase();
    const homeTeamIdentifierFull = game.homeTeam.identifierFull.toLowerCase();

    const teamNameElement = await this.reference.$('th');

    if (!teamNameElement) {
      return false;
    }

    const teamNameElementTextContent = (await teamNameElement.evaluate((el) => el.textContent))?.toLowerCase();

    if (!teamNameElementTextContent) {
      return false;
    }

    if (teamNameElementTextContent.includes(awayTeamIdentifierFull)) {
      return true;
    }

    if (teamNameElementTextContent.includes(homeTeamIdentifierFull)) {
      return true;
    }

    return false;
  }
}