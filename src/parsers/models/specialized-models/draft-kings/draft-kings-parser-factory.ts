import {
  DbGameConnection, DbStatisticConnection, OddButtonParserSet, OddButtonWrapper,
  SpecializedDbGameConnection, SpecializedDbStatisticConnection, SpecializedOddButtonParserSet,
  SpecializedOddButtonWrapper, SpecializedParserFactory,
} from '@/parsers/models/common-models';
import {
  DraftKingsDbGameConnection, DraftKingsDbStatisticConnection, DraftKingsOddButtonParserSet,
  DraftKingsOddButtonWrapper,
} from '@/parsers/models/specialized-models/draft-kings';

export class DraftKingsParserFactory implements SpecializedParserFactory {
  public async createOddButtonParserSet({
    parent,
  }: {
    parent: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return await DraftKingsOddButtonParserSet.create({ parent });
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