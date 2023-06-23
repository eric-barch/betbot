import { GameWithTeams } from '@/db';
import { OddButtonParser, ParserFactory, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedDbGameInitializer {
  findOrCreateCorrespondingDbGame(): Promise<GameWithTeams>;
}

export class DbGameInitializer {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parserFactory: SpecializedParserFactory;
  private wrappedSpecializedDbGameInitializer: SpecializedDbGameInitializer | undefined;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parentOddButtonParser,
    parserFactory,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: SpecializedParserFactory,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.parserFactory = parserFactory;
  }

  public static async create({
    parentOddButtonParser,
    parserFactory,
  }: {
    parentOddButtonParser: OddButtonParser,
    parserFactory: SpecializedParserFactory,
  }): Promise<DbGameInitializer> {
    const dbGameInitializer = new DbGameInitializer({
      parentOddButtonParser,
      parserFactory,
    });
    await dbGameInitializer.init();
    return dbGameInitializer;
  }

  private async init(): Promise<DbGameInitializer> {
    this.specializedDbGameInitializer = await this.parserFactory.createDbGameInitializer({
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