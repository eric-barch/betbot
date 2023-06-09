import { Game } from '@prisma/client';
import { OddButtonParser } from '../odd-button-parser';

export abstract class DbGameConnection {
  private wrappedParentOddButtonParser: OddButtonParser;
  private wrappedGame: Game | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser
  }) {
    this.wrappedParentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DbGameConnection> {
    this.game = await this.updateDbGame();
    return this;
  }

  protected abstract updateDbGame(): Promise<Game>;

  protected get parentOddButtonParser(): OddButtonParser {
    return this.wrappedParentOddButtonParser;
  }

  protected set game(game: Game) {
    this.wrappedGame = game;
  }

  public get game(): Game {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }
}