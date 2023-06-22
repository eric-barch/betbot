import { prisma } from '@/db';
import {
  OddButtonParser, OddButtonWrapper, SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';

export class DraftKingsOddButtonWrapper implements SpecializedOddButtonWrapper {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parentOddButtonWrapper: OddButtonWrapper;
  private wrappedReferenceSelector: string | undefined;

  public constructor({
    parentOddButtonParser,
    parentOddButtonWrapper,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentOddButtonWrapper: OddButtonWrapper,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parentOddButtonWrapper = parentOddButtonWrapper;
    this.referenceSelector = 'tr';
  }

  public async generateReferenceSelector(): Promise<string> {
    return this.referenceSelector;
  }

  public async confirmOddButtonPosition(): Promise<boolean> {
    const game = this.parentOddButtonParser.game;

    // TODO: Eagerly load participating teams elsewhere in application so we don't have to do 
    // this here.
    const awayTeam = await prisma.team.findUniqueOrThrow({
      where: {
        id: game.awayTeamId,
      }
    });
    const homeTeam = await prisma.team.findUniqueOrThrow({
      where: {
        id: game.homeTeamId,
      }
    });

    const awayTeamIdentifierFull = awayTeam.identifierFull.toLowerCase();
    const homeTeamIdentifierFull = homeTeam.identifierFull.toLowerCase();

    const reference = this.parentOddButtonWrapper.reference;
    const teamNameElement = await reference.$('th');

    if (!teamNameElement) {
      return false;
    }

    // TODO: Replace all 'getProperty's with 'evaluate's.
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