import { Game } from '@prisma/client';

import { CommonOddButtonParser } from '@/parsers/models/common-models';

export abstract class DbGameInitializer {
  protected readonly parentOddButtonParser: CommonOddButtonParser;
  private wrappedGame: Game | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: CommonOddButtonParser,
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