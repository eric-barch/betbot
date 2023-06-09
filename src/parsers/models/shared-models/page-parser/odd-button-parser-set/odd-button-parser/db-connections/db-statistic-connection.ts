import { Statistic } from '@prisma/client';
import { OddButtonParser } from '../odd-button-parser';

export abstract class DbStatisticConnection {
  private wrappedParentOddButtonParser: OddButtonParser;
  private wrappedStatistic: Statistic | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.wrappedParentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DbStatisticConnection> {
    this.statistic = await this.updateDbStatistic();
    return this;
  }

  protected abstract updateDbStatistic(): Promise<Statistic>;

  protected get parentOddButtonParser(): OddButtonParser {
    return this.wrappedParentOddButtonParser;
  }

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