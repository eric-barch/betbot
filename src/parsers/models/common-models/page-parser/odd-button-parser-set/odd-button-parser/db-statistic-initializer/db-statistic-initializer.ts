import { Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams, prisma } from '@/db';
import { OddButtonParser, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedDbStatisticInitializer {
  parseStatisticName(): Promise<string>;
}

export class DbStatisticInitializer {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private wrappedSpecializedDbStatisticInitializer: SpecializedDbStatisticInitializer | undefined;
  private wrappedStatistic: Statistic | null | undefined;

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
  }): Promise<DbStatisticInitializer> {
    const dbStatisticInitializer = new DbStatisticInitializer({
      parentOddButtonParser,
      specializedParserFactory,
    });
    await dbStatisticInitializer.init();
    return dbStatisticInitializer;
  }

  private async init(): Promise<DbStatisticInitializer> {
    this.specializedDbStatisticInitializer = await this.specializedParserFactory.createDbStatisticInitializer({ parentDbStatisticInitializer: this });

    try {
      this.statistic = await this.findOrCreateStatistic();
    } catch (error) {
      this.statistic = null;
    }

    return this;
  }

  private async findOrCreateStatistic(): Promise<Statistic> {
    const name = await this.specializedDbStatisticInitializer.parseStatisticName();
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

  private set specializedDbStatisticInitializer(specializedDbStatisticInitializer: SpecializedDbStatisticInitializer) {
    this.wrappedSpecializedDbStatisticInitializer = specializedDbStatisticInitializer;
  }

  private get specializedDbStatisticInitializer(): SpecializedDbStatisticInitializer {
    if (!this.wrappedSpecializedDbStatisticInitializer) {
      throw new Error(`wrappedSpecializedDbStatisticInitializer is undefined.`);
    }

    return this.wrappedSpecializedDbStatisticInitializer;
  }

  private set statistic(statistic: Statistic | null) {
    this.wrappedStatistic = statistic;
  }

  public get statistic(): Statistic | null {
    if (this.wrappedStatistic === undefined) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }
}