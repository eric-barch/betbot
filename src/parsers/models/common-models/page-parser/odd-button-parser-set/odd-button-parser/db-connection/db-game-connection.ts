import { Exchange, League } from '@prisma/client';
import { ElementHandle, Page } from 'puppeteer';

import { GameWithTeams } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';

export interface SpecializedDbGameConnection {
  findOrCreateGame(): Promise<GameWithTeams>;
}

export class DbGameConnection {
  private readonly parentOddButtonParser: OddButtonParser;
  private wrappedSpecializedDbGameConnection: SpecializedDbGameConnection | undefined;
  private wrappedGame: GameWithTeams | undefined;

  private constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<DbGameConnection> {
    const dbGameConnection = new DbGameConnection({
      parentOddButtonParser,
    });
    await dbGameConnection.init();
    return dbGameConnection;
  }

  private async init(): Promise<DbGameConnection> {
    this.specializedDbGameConnection = await this
      .parentOddButtonParser
      .parent
      .specializedParserFactory
      .createDbGameConnection({
        parentDbGameConnection: this,
      });
    this.game = await this.specializedDbGameConnection.findOrCreateGame();
    return this;
  }

  public get page(): Page {
    return this.parentOddButtonParser.parent.page;
  }

  public get button(): ElementHandle | null {
    return this.parentOddButtonParser.button;
  }

  public get exchange(): Exchange {
    return this.parentOddButtonParser.parent.exchange;
  }

  public get league(): League {
    return this.parentOddButtonParser.parent.league;
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