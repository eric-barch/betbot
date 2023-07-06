import { Team } from '@prisma/client';

import { GameWithTeams } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';

export abstract class DbGameConnection {
  public readonly parent: OddButtonParser;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;
  private wrappedStartDate: Date | undefined;
  private wrappedGame: GameWithTeams | undefined;

  protected constructor({
    parent,
  }: {
    parent: OddButtonParser,
  }) {
    this.parent = parent;
  }

  protected async init(): Promise<DbGameConnection> {
    this.game = await this.findOrCreateGame();
    return this;
  }

  protected abstract findOrCreateGame(): Promise<GameWithTeams>;

  public get game(): GameWithTeams {
    if (this.wrappedGame === undefined) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  protected set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }

  protected set awayTeam(awayTeam: Team) {
    this.wrappedAwayTeam = awayTeam;
  }

  protected get awayTeam(): Team {
    if (this.wrappedAwayTeam === undefined) {
      throw new Error(`wrappedAwayTeam is undefined.`);
    }

    return this.wrappedAwayTeam;
  }

  protected set homeTeam(homeTeam: Team) {
    this.wrappedHomeTeam = homeTeam;
  }

  protected get homeTeam(): Team {
    if (this.wrappedHomeTeam === undefined) {
      throw new Error(`wrappedHomeTeam is undefined.`);
    }

    return this.wrappedHomeTeam;
  }
}