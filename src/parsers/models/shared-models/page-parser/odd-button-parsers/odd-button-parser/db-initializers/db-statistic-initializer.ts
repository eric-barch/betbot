import { Statistic } from '@prisma/client';

import { OddButtonParser } from '@/parsers/models/shared-models';

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

  protected abstract updateDbStatistic(): Promise<Statistic>;

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