import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  SpecializedDbGameConnection, SpecializedDbStatisticConnection, SpecializedOddButtonParser,
  SpecializedOddButtonParserSet, SpecializedOddButtonWrapper, SpecializedParserFactory,
} from '@/parsers/models/common-models';



export class FanDuelParserFactory implements SpecializedParserFactory {
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

  public async createDbGameConnection({
    parentDbGameConnection,
  }: {
    parentDbGameConnection: DbGameConnection,
  }): Promise<SpecializedDbGameConnection> {
    throw new Error(`Implement createDbGameConnection.`);
    // return new FanDuelDbGameConnection({
    //   parentDbGameConnection,
    // });
  }

  public async createDbStatisticConnection({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection,
  }): Promise<SpecializedDbStatisticConnection> {
    throw new Error(`Implement createDbStatisticConnection.`);
    // return new FanDuelDbStatisticConnection({
    //   parentDbStatisticConnection,
    // });
  }
}