import {
  DbGameInitializer, DbStatisticInitializer, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer,
  SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet,
  SpecializedOddButtonWrapper, SpecializedParserFactory,
} from '@/parsers/models/common-models';
import { FanDuelJsonGamesParser } from '@/parsers/models/specialized-models/fan-duel';



export class FanDuelParserFactory implements SpecializedParserFactory {
  public async createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser> {
    return await FanDuelJsonGamesParser.create({ parentPageParser });
  }

  public async createOddButtonParserSet({
    parentOddButtonParserSet,
  }: {
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    throw new Error(`Implement createOddButtonParserSet.`);
    // return new FanDuelOddButtonParserSet();
  }

  public async createOddButtonParser({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser> {
    throw new Error(`Implement createOddButtonParser.`);
    // return new FanDuelOddButtonParser({
    //   parentOddButtonParser,
    // });
  }

  public async createOddButtonWrapper({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper> {
    throw new Error(`Implement createOddButtonWrapper.`);
    // return new FanDuelOddButtonWrapper({
    //   parentOddButtonWrapper,
    // });
  }

  public async createDbGameInitializer({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<SpecializedDbGameInitializer> {
    throw new Error(`Implement createDbGameInitializer.`);
    // return new FanDuelDbGameInitializer({
    //   parentDbGameInitializer,
    // });
  }

  public async createDbStatisticInitializer({
    parentDbStatisticInitializer,
  }: {
    parentDbStatisticInitializer: DbStatisticInitializer,
  }): Promise<SpecializedDbStatisticInitializer> {
    throw new Error(`Implement createDbStatisticInitializer.`);
    // return new FanDuelDbStatisticInitializer({
    //   parentDbStatisticInitializer,
    // });
  }
}