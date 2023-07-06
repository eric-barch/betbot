import {
  DbGameConnection, DbStatisticConnection, OddButtonParserSet, OddButtonWrapper,
  SpecializedDbGameConnection, SpecializedDbStatisticConnection, SpecializedOddButtonParserSet,
  SpecializedOddButtonWrapper, SpecializedParserFactory
} from '@/parsers/models/common-models';
import {
  FanDuelDbGameConnection, FanDuelDbStatisticConnection,
  FanDuelOddButtonParserSet, FanDuelOddButtonWrapper
} from '@/parsers/models/specialized-models/fan-duel';

/**TODO: Not 100% sure why we are directly invoking constructor here. Should these be asynchronous
 * instantiations? */
export class FanDuelParserFactory implements SpecializedParserFactory {
  public async createOddButtonParserSet({
    parent,
  }: {
    parent: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return await FanDuelOddButtonParserSet.create({ parent });
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