import {
  DbGameInitializer, DbStatisticInitializer, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedParserFactory, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer,
  SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet,
  SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';
import {
  DraftKingsDbGameInitializer, DraftKingsDbStatisticInitializer, DraftKingsJsonGamesParser,
  DraftKingsOddButtonParser, DraftKingsOddButtonParserSet, DraftKingsOddButtonWrapper,
} from '@/parsers/models/specialized-models/draft-kings';

export class DraftKingsParserFactory implements SpecializedParserFactory {
  public async createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser> {
    return await DraftKingsJsonGamesParser.create({ parentPageParser });
  }

  public async createOddButtonParserSet({
    parentOddButtonParserSet,
  }: {
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return new DraftKingsOddButtonParserSet();
  }

  public async createOddButtonParser({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser> {
    return new DraftKingsOddButtonParser({
      parentOddButtonParser,
    });
  }

  public async createOddButtonWrapper({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper> {
    return new DraftKingsOddButtonWrapper({
      parentOddButtonWrapper,
    });
  }

  public async createDbGameInitializer({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<SpecializedDbGameInitializer> {
    return new DraftKingsDbGameInitializer({
      parentDbGameInitializer,
    });
  }

  public async createDbStatisticInitializer({
    parentDbStatisticInitializer,
  }: {
    parentDbStatisticInitializer: DbStatisticInitializer,
  }): Promise<SpecializedDbStatisticInitializer> {
    return new DraftKingsDbStatisticInitializer({
      parentDbStatisticInitializer,
    });
  }
}