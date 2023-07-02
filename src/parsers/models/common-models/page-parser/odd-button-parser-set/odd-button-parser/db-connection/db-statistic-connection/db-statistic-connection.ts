import { Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams, prisma } from '@/db';
import { OddButtonParser, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedDbStatisticConnection {
  parseStatisticName(): Promise<string>;
}

export class DbStatisticConnection {
  private readonly parentOddButtonParser: OddButtonParser;
  private wrappedSpecializedDbStatisticConnection: SpecializedDbStatisticConnection | undefined;
  private wrappedStatistic: Statistic | undefined;

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
  }): Promise<DbStatisticConnection> {
    const dbStatisticConnection = new DbStatisticConnection({
      parentOddButtonParser,
    });
    await dbStatisticConnection.init();
    return dbStatisticConnection;
  }

  private async init(): Promise<DbStatisticConnection> {
    this.specializedDbStatisticConnection = await this
      .parentOddButtonParser
      .parentPageParser
      .specializedParserFactory
      .createDbStatisticConnection({
        parentDbStatisticConnection: this,
      });
    this.statistic = await this.findOrCreateStatistic();
    return this;
  }

  private async findOrCreateStatistic(): Promise<Statistic> {
    const name = await this.specializedDbStatisticConnection.parseStatisticName();
    const gameId = this.parentOddButtonParser.game.id;

    this.statistic = await prisma.statistic.upsert({
      where: {
        name_gameId: {
          name,
          gameId,
        },
      },
      update: {},
      create: {
        name,
        gameId,
      },
    });

    return this.statistic;
  }

  public get button(): ElementHandle | null {
    return this.parentOddButtonParser.button;
  }

  public get game(): GameWithTeams {
    return this.parentOddButtonParser.game;
  }

  private set specializedDbStatisticConnection(specializedDbStatisticConnection: SpecializedDbStatisticConnection) {
    this.wrappedSpecializedDbStatisticConnection = specializedDbStatisticConnection;
  }

  private get specializedDbStatisticConnection(): SpecializedDbStatisticConnection {
    if (!this.wrappedSpecializedDbStatisticConnection) {
      throw new Error(`wrappedSpecializedDbStatisticConnection is undefined.`);
    }

    return this.wrappedSpecializedDbStatisticConnection;
  }

  private set statistic(statistic: Statistic) {
    this.wrappedStatistic = statistic;
  }

  public get statistic(): Statistic {
    if (this.wrappedStatistic === undefined) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }
}