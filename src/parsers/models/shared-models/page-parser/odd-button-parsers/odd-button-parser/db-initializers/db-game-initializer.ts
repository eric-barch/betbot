import { Game } from '@prisma/client';
import { OddButtonParser } from '../odd-button-parser';

export abstract class DbGameInitializer {
  protected readonly parentOddButtonParser: OddButtonParser;
  private wrappedGame: Game | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DbGameInitializer> {
    this.game = await this.updateDbGame();
    return this;
  }

  protected abstract updateDbGame(): Promise<Game>;

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