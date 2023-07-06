import { ElementHandle } from 'puppeteer';

import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, SpecializedDbGameConnection, SpecializedDbStatisticConnection,
  ParserFactory,
} from '@/parsers/models/common-models';
import {
  FanDuelDbGameConnection, FanDuelDbStatisticConnection,
  FanDuelOddButtonParserSet, FanDuelOddButtonWrapper
} from '@/parsers/models/specialized-models/fan-duel';

/**TODO: Not 100% sure why we are directly invoking constructor in these. Should these be asynchronous
 * instantiations? */
export class FanDuelParserFactory implements ParserFactory {
  public async createOddButtonParserSet({
    parent,
  }: {
    parent: PageParser,
  }): Promise<OddButtonParserSet> {
    return await FanDuelOddButtonParserSet.create({ parent });
  }

  public async createOddButtonWrapper({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<OddButtonWrapper> {
    return await FanDuelOddButtonWrapper.create({
      parent,
      oddButton,
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