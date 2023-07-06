import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbGameConnection, SpecializedDbStatisticConnection,
  SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper,
} from '@/parsers/models/common-models';
import { DraftKingsParserFactory, FanDuelParserFactory } from '@/parsers/models/specialized-models';

export abstract class SpecializedParserFactory {
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

  abstract createOddButtonParserSet({
    parent,
  }: {
    parent: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet>;

  abstract createOddButtonParser({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser>;

  abstract createOddButtonWrapper({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper>;

  abstract createDbGameConnection({
    parentDbGameConnection,
  }: {
    parentDbGameConnection: DbGameConnection,
  }): Promise<SpecializedDbGameConnection>;

  abstract createDbStatisticConnection({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection,
  }): Promise<SpecializedDbStatisticConnection>;
}