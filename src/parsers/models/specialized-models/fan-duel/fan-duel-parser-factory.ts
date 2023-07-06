import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  SpecializedDbGameConnection, SpecializedDbStatisticConnection, SpecializedOddButtonParser,
  SpecializedOddButtonParserSet, SpecializedOddButtonWrapper, SpecializedParserFactory,
} from '@/parsers/models/common-models';
import {
  FanDuelDbGameConnection, FanDuelDbStatisticConnection, FanDuelOddButtonParser,
  FanDuelOddButtonParserSet, FanDuelOddButtonWrapper,
} from '@/parsers/models/specialized-models/fan-duel';

/**TODO: Not 100% sure why we are directly invoking constructor here. Should these be asynchronous
 * instantiations? */
export class FanDuelParserFactory implements SpecializedParserFactory {
  public async createOddButtonParserSet({
    parentOddButtonParserSet,
  }: {
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return new FanDuelOddButtonParserSet({
      parentOddButtonParserSet,
    });
  }

  public async createOddButtonParser({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser> {
    return new FanDuelOddButtonParser({
      parentOddButtonParser,
    })
  }

  public async createOddButtonWrapper({
    parentOddButtonWrapper,
  }: {
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper> {
    return new FanDuelOddButtonWrapper({
      parentOddButtonWrapper,
    });
  }

  public async createDbGameConnection({
    parentDbGameConnection,
  }: {
    parentDbGameConnection: DbGameConnection,
  }): Promise<SpecializedDbGameConnection> {
    return new FanDuelDbGameConnection({
      parentDbGameConnection,
    });
  }

  public async createDbStatisticConnection({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection,
  }): Promise<SpecializedDbStatisticConnection> {
    return new FanDuelDbStatisticConnection({
      parentDbStatisticConnection,
    });
  }
}