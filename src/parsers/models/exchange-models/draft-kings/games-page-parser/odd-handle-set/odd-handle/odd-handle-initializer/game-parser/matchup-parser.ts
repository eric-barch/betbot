import { Team } from '@prisma/client';
import { GameWithoutExchangeAssignedIdParser } from './game-without-exchange-assigned-id-parser';

export class MatchupParser {
  private parent: GameWithoutExchangeAssignedIdParser;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;

  constructor({
    parent,
  }: {
    parent: GameWithoutExchangeAssignedIdParser,
  }) {
    this.parent = parent;
  }

  public async parse(): Promise<{
    awayTeam: Team,
    homeTeam: Team,
  }> {

    return {
      awayTeam: this.awayTeam,
      homeTeam: this.homeTeam,
    }
  }

  public get awayTeam(): Team {
    if (!this.wrappedAwayTeam) {
      throw new Error(`wrappedAwayTeam is undefined.`);
    }

    return this.wrappedAwayTeam;
  }

  private set awayTeam(awayTeam: Team) {
    this.wrappedAwayTeam = awayTeam;
  }

  public get homeTeam(): Team {
    if (!this.wrappedHomeTeam) {
      throw new Error(`wrappedHomeTeam is undefined.`);
    }

    return this.wrappedHomeTeam;
  }

  private set homeTeam(homeTeam: Team) {
    this.wrappedHomeTeam = homeTeam;
  }
}