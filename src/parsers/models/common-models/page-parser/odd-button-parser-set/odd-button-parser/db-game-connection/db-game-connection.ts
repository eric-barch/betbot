import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import { OddButtonParser, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedDbGameConnection {
  findOrCreateGame(): Promise<GameWithTeams>;
}

export class DbGameConnection {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private wrappedSpecializedDbGameConnection: SpecializedDbGameConnection | undefined;
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
  }): Promise<DbGameConnection> {
    const dbGameConnection = new DbGameConnection({
      parentOddButtonParser,
      specializedParserFactory,
    });
    await dbGameConnection.init();
    return dbGameConnection;
  }

  private async init(): Promise<DbGameConnection> {
    this.specializedDbGameConnection = await this.specializedParserFactory.createDbGameConnection({
      parentDbGameConnection: this,
    });
    this.game = await this.specializedDbGameConnection.findOrCreateGame();
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

  private set specializedDbGameConnection(specializedDbGameConnection: SpecializedDbGameConnection) {
    this.wrappedSpecializedDbGameConnection = specializedDbGameConnection;
  }

  private get specializedDbGameConnection(): SpecializedDbGameConnection {
    if (!this.wrappedSpecializedDbGameConnection) {
      throw new Error(`wrappedSpecializedDbGameConnection is undefined.`);
    }

    return this.wrappedSpecializedDbGameConnection;
  }

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }
}