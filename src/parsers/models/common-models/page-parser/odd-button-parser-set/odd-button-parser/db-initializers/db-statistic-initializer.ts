import { Statistic } from '@prisma/client';

import { OddButtonParser } from '@/parsers/models/common-models';
import { prisma } from '@/db';
import { ParserFactory } from '@/parsers/models/common-models/parser-factory';

export interface SpecializedDbStatisticInitializer {
  parseStatisticName(): Promise<string>;
}

export class DbStatisticInitializer {
  private readonly parentOddButtonParser: OddButtonParser;
  private readonly parserFactory: ParserFactory;
  private wrappedSpecializedDbStatisticInitializer: SpecializedDbStatisticInitializer | undefined;
  private wrappedStatistic: Statistic | undefined;

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
  }): Promise<DbStatisticInitializer> {
    const dbStatisticInitializer = new DbStatisticInitializer({
      parentOddButtonParser,
      parserFactory,
    });
    await dbStatisticInitializer.init();
    return dbStatisticInitializer;
  }

  private async init(): Promise<DbStatisticInitializer> {
    this.specializedDbStatisticInitializer = await this.parserFactory.createDbStatisticInitializer();

    this.statistic = await this.updateDbStatistic();

    return this;
  }

  private async updateDbStatistic(): Promise<Statistic> {
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

  private set specializedDbStatisticInitializer(specializedDbStatisticInitializer: SpecializedDbStatisticInitializer) {
    this.wrappedSpecializedDbStatisticInitializer = specializedDbStatisticInitializer;
  }

  private get specializedDbStatisticInitializer(): SpecializedDbStatisticInitializer {
    if (!this.wrappedSpecializedDbStatisticInitializer) {
      throw new Error(`wrappedSpecializedDbStatisticInitializer is undefined.`);
    }

    return this.wrappedSpecializedDbStatisticInitializer;
  }

  private set statistic(statistic: Statistic) {
    this.wrappedStatistic = statistic;
  }

  public get statistic(): Statistic {
    if (!this.wrappedStatistic) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }
}