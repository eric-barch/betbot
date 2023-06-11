import { Game } from '@prisma/client';

export abstract class DbGame {
  private wrappedGame: Game | undefined;

  protected async init(): Promise<DbGame> {
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