import {
  DbGameInitializer, DbStatisticInitializer, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer,
  SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet,
  SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';
import { DraftKingsParserFactory } from '@/parsers/models/specialized-models';

export class ParserFactory {
  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedParserFactory> {
    switch (parentPageParser.exchange.name) {
      case 'DraftKings':
        return new DraftKingsParserFactory();
      default:
        throw new Error(`No specialized parser factory found for exchange ${parentPageParser.exchange.name}`);
    }
  }
}

export interface SpecializedParserFactory {
  createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser>;

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