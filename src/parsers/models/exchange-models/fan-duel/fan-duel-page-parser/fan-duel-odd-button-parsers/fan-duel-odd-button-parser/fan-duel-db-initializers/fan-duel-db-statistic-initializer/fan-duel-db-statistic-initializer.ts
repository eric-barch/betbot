import { DbStatisticInitializer, OddButtonParser } from '@/parsers/models/shared-models';

export class FanDuelDbStatisticInitializer extends DbStatisticInitializer {
  public static async create({
    parentOddButtonParser
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<FanDuelDbStatisticInitializer> {
    const fanDuelDbStatisticInitializer = new FanDuelDbStatisticInitializer({ parentOddButtonParser });
    await fanDuelDbStatisticInitializer.init();
    return fanDuelDbStatisticInitializer;
  }

  protected async init(): Promise<FanDuelDbStatisticInitializer> {
    await super.init();
    return this;
  }
}