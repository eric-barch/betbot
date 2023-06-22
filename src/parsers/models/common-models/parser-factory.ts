import {
  DbGameInitializer, DbStatisticInitializer, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer,
  SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet,
  SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';

export interface ParserFactory {
  createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser>;

  createOddButtonParserSet({
    parentPageParser,
    parentOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    parentPageParser,
    parentOddButtonParser,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser>;

  createOddButtonWrapper({
    parentOddButtonParser,
    parentOddButtonWrapper,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper>;

  createDbGameInitializer({
    parentOddButtonParser,
    parentDbGameInitializer,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentDbGameInitializer: DbGameInitializer,
  }): Promise<SpecializedDbGameInitializer>;

  createDbStatisticInitializer({
    parentOddButtonParser,
    parentDbStatisticInitializer,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentDbStatisticInitializer: DbStatisticInitializer,
  }): Promise<SpecializedDbStatisticInitializer>;
}