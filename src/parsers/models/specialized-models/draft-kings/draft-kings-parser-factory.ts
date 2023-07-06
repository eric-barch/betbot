import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  SpecializedDbGameConnection, SpecializedDbStatisticConnection, SpecializedOddButtonParser,
  SpecializedOddButtonParserSet, SpecializedOddButtonWrapper, SpecializedParserFactory,
} from '@/parsers/models/common-models';
import {
  DraftKingsDbGameConnection, DraftKingsDbStatisticConnection,
  DraftKingsOddButtonParser, DraftKingsOddButtonParserSet, DraftKingsOddButtonWrapper
} from '@/parsers/models/specialized-models/draft-kings';

export class DraftKingsParserFactory implements SpecializedParserFactory {
  public async createOddButtonParserSet({
    parent,
  }: {
    parent: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return await DraftKingsOddButtonParserSet.create({ parent });
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

  public async createDbGameConnection({
    parentDbGameConnection,
  }: {
    parentDbGameConnection: DbGameConnection,
  }): Promise<SpecializedDbGameConnection> {
    return new DraftKingsDbGameConnection({
      parentDbGameConnection,
    });
  }

  public async createDbStatisticConnection({
    parentDbStatisticConnection,
  }: {
    parentDbStatisticConnection: DbStatisticConnection,
  }): Promise<SpecializedDbStatisticConnection> {
    return new DraftKingsDbStatisticConnection({
      parentDbStatisticConnection,
    });
  }
}