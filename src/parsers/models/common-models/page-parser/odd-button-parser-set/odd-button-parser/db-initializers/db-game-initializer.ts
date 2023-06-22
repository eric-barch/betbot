import { Game } from '@prisma/client';

import { OddButtonParser } from '@/parsers/models/common-models';
import { ParserFactory } from '@/parsers/models/common-models/parser-factory';

export interface SpecializedDbGameInitializer {
  findOrCreateCorrespondingDbGame(): Promise<Game>;
}

export class DbGameInitializer {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parserFactory: ParserFactory;
  private wrappedSpecializedDbGameInitializer: SpecializedDbGameInitializer | undefined;
  private wrappedGame: Game | undefined;

  private constructor({
    parentOddButtonParser,
    parserFactory,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: ParserFactory,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parserFactory = parserFactory;
  }

  public static async create({
    parentOddButtonParser,
    parserFactory,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: ParserFactory,
  }): Promise<DbGameInitializer> {
    const dbGameInitializer = new DbGameInitializer({
      parentOddButtonParser,
      parserFactory,
    });
    await dbGameInitializer.init();
    return dbGameInitializer;
  }

  private async init(): Promise<DbGameInitializer> {
    this.specializedDbGameInitializer = await this.parserFactory.createDbGameInitializer();

    this.game = await this.specializedDbGameInitializer.findOrCreateCorrespondingDbGame();

    return this;
  }

  private set specializedDbGameInitializer(specializedDbGameInitializer: SpecializedDbGameInitializer) {
    this.wrappedSpecializedDbGameInitializer = specializedDbGameInitializer;
  }

  private get specializedDbGameInitializer(): SpecializedDbGameInitializer {
    if (!this.wrappedSpecializedDbGameInitializer) {
      throw new Error(`wrappedSpecializedDbGameInitializer is undefined.`);
    }

    return this.wrappedSpecializedDbGameInitializer;
  }

  public get game(): Game {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set game(game: Game) {
    this.wrappedGame = game;
  }
}