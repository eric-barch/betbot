import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import { OddButtonParser, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedDbGameInitializer {
  findOrCreateGame(): Promise<GameWithTeams>;
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
      parentDbGameInitializer: this,
    });

    this.game = await this.specializedDbGameInitializer.findOrCreateGame();

    return this;
  }

  public get button(): ElementHandle | null {
    return this.parentOddButtonParser.button;
  }

  public get exchange(): Exchange {
    return this.parentOddButtonParser.exchange;
  }

  public get league(): League {
    return this.parentOddButtonParser.league;
  }

  public get game(): GameWithTeams {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
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

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }
}