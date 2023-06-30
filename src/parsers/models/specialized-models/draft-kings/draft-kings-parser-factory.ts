import {
  DbGameInitializer, DbStatisticInitializer, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  SpecializedDbGameInitializer, SpecializedDbStatisticInitializer, SpecializedOddButtonParser,
  SpecializedOddButtonParserSet, SpecializedOddButtonWrapper, SpecializedParserFactory,
} from '@/parsers/models/common-models';
import {
  DraftKingsDbGameInitializer, DraftKingsDbStatisticInitializer,
  DraftKingsOddButtonParser, DraftKingsOddButtonParserSet, DraftKingsOddButtonWrapper
} from '@/parsers/models/specialized-models/draft-kings';

export class DraftKingsParserFactory implements SpecializedParserFactory {
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