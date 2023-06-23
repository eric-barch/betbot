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