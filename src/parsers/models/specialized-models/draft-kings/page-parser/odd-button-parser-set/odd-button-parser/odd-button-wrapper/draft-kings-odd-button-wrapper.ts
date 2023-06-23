import {
  OddButtonWrapper, SpecializedOddButtonWrapper
} from '@/parsers/models/common-models';

export class DraftKingsOddButtonWrapper implements SpecializedOddButtonWrapper {
  private readonly parentOddButtonWrapper: OddButtonWrapper;
  private wrappedReferenceSelector: string | undefined;

  public constructor({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }) {
    this.parentOddButtonWrapper = parentOddButtonWrapper;
    this.referenceSelector = 'tr';
  }

  public async generateReferenceSelector(): Promise<string> {
    return this.referenceSelector;
  }

  public async verifyOddButtonPosition(): Promise<boolean> {
    const game = this.parentOddButtonWrapper.game;

    const awayTeamIdentifierFull = game.awayTeam.identifierFull.toLowerCase();
    const homeTeamIdentifierFull = game.homeTeam.identifierFull.toLowerCase();

    const reference = this.parentOddButtonWrapper.referenceElement;
    const teamNameElement = await reference.$('th');

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

  private set referenceSelector(referenceSelector: string) {
    this.wrappedReferenceSelector = referenceSelector;
  }

  private get referenceSelector(): string {
    if (!this.wrappedReferenceSelector) {
      throw new Error(`Reference selector not set.`);
    }

    return this.wrappedReferenceSelector;
  }
}