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
    parentPageParser,
    parentOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return new DraftKingsOddButtonParserSet({
      parentPageParser,
      parentOddButtonParserSet,
    });
  }

  public async createOddButtonParser({
    parentPageParser,
    parentOddButtonParser,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser> {
    return new DraftKingsOddButtonParser({
      parentPageParser,
      parentOddButtonParser,
    });
  }

  public async createOddButtonWrapper({
    parentOddButtonParser,
    parentOddButtonWrapper,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper> {
    return new DraftKingsOddButtonWrapper({
      parentOddButtonParser,
      parentOddButtonWrapper,
    });
  }

  public async createDbGameInitializer({
    parentOddButtonParser,
    parentDbGameInitializer,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<SpecializedDbGameInitializer> {
    return new DraftKingsDbGameInitializer({
      parentOddButtonParser,
      parentDbGameInitializer,
    });
  }

  public async createDbStatisticInitializer({
    parentOddButtonParser,
    parentDbStatisticInitializer,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentDbStatisticInitializer: DbStatisticInitializer,
  }): Promise<SpecializedDbStatisticInitializer> {
    return new DraftKingsDbStatisticInitializer({
      parentOddButtonParser,
      parentDbStatisticInitializer,
    });
  }
}