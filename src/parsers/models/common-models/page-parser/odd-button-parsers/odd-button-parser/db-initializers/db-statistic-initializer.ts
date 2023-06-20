import { Statistic } from '@prisma/client';

import { OddButtonParser } from '@/parsers/models/common-models';
import { prisma } from '@/db';

export abstract class DbStatisticInitializer {
  protected readonly parentOddButtonParser: OddButtonParser;
  private wrappedStatistic: Statistic | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DbStatisticInitializer> {
    this.statistic = await this.updateDbStatistic();
    return this;
  }

  protected async updateDbStatistic(): Promise<Statistic> {
    const name = await this.parseStatisticName();
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

  protected abstract parseStatisticName(): Promise<string>;

  protected set statistic(statistic: Statistic) {
    this.wrappedStatistic = statistic;
  }

  public get statistic(): Statistic {
    if (!this.wrappedStatistic) {
      throw new Error(`wrappedStatistic is undefined.`);
    }

    return this.wrappedStatistic;
  }
}