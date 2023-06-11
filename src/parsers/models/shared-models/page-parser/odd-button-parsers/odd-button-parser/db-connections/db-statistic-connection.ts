import { Statistic } from '@prisma/client';

export abstract class DbStatistic {
  private wrappedStatistic: Statistic | undefined;

  protected async init(): Promise<DbStatistic> {
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