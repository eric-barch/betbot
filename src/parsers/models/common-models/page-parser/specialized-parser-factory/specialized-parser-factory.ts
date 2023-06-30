import {
  DbGameInitializer, DbStatisticInitializer, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer,
  SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';
import { DraftKingsParserFactory, FanDuelParserFactory } from '@/parsers/models/specialized-models';

/**TODO: HATE this name. Is there some way we can make SpecializedParserFactory have a static
 * create method to avoid having two classes here? Attempted to implement that before but ran into
 * circular dependency issues. */
export class SpecializedParserFactoryFactory {
  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedParserFactory> {
    switch (parentPageParser.exchange.name) {
      case 'DraftKings':
        return new DraftKingsParserFactory();
      case 'FanDuel':
        return new FanDuelParserFactory();
      default:
        throw new Error(`No specialized parser factory found for exchange ${parentPageParser.exchange.name}`);
    }
  }
}

export interface SpecializedParserFactory {
  createOddButtonParserSet({
    parentOddButtonParserSet,
  }: {
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser>;

  createOddButtonWrapper({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper>;

  createDbGameInitializer({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<SpecializedDbGameInitializer>;

  createDbStatisticInitializer({
    parentDbStatisticInitializer,
  }: {
    parentDbStatisticInitializer: DbStatisticInitializer,
  }): Promise<SpecializedDbStatisticInitializer>;
}