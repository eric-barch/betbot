import { GameWithTeams } from '@/db';
import { OddButtonParser, ParserFactory, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedDbGameInitializer {
  findOrCreateCorrespondingDbGame(): Promise<GameWithTeams>;
}

export class DbGameInitializer {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private wrappedSpecializedDbGameInitializer: SpecializedDbGameInitializer | undefined;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parentOddButtonParser,
    specializedParserFactory,
  }: {
    parentOddButtonParser: OddButtonParser,
    specializedParserFactory: SpecializedParserFactory,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.specializedParserFactory = specializedParserFactory;
  }

  public static async create({
    parentOddButtonParser,
    specializedParserFactory,
  }: {
    parentOddButtonParser: OddButtonParser,
    specializedParserFactory: SpecializedParserFactory,
  }): Promise<DbGameInitializer> {
    const dbGameInitializer = new DbGameInitializer({
      parentOddButtonParser,
      specializedParserFactory,
    });
    await dbGameInitializer.init();
    return dbGameInitializer;
  }

  private async init(): Promise<DbGameInitializer> {
    this.specializedDbGameInitializer = await this.specializedParserFactory.createDbGameInitializer({
      parentOddButtonParser: this.parentOddButtonParser,
      parentDbGameInitializer: this,
    });

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

  public get game(): GameWithTeams {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }
}