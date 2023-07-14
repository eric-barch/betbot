import { ElementHandle } from 'puppeteer';

import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, ParserFactory,
} from '@/parsers/models/common-models';
import {
  FanDuelDbGameConnection, FanDuelDbStatisticConnection, FanDuelOddButtonParserSet,
  FanDuelOddButtonWrapper,
} from '@/parsers/models/specialized-models/fan-duel';
import { GameWithTeams } from '@/db';

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
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<DbGameConnection> {
    return await FanDuelDbGameConnection.create({ parent });
  }

  public async createDbStatisticConnection({
    parent,
    game,
  }: {
    parent: OddButtonParser,
    game: GameWithTeams,
  }): Promise<DbStatisticConnection> {
    return await FanDuelDbStatisticConnection.create({
      parent,
      game,
    });
  }
}