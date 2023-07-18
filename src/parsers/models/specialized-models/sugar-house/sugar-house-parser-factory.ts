import { ElementHandle } from 'puppeteer';

import {
  DbGameConnection,
  DbStatisticConnection,
  OddButtonParser, OddButtonParserSet, PageParser, ParserFactory,
} from '@/parsers/models/common-models';
import { GameWithTeams } from '@/db';

export class SugarHouseParserFactory implements ParserFactory {
  public async createOddButtonParserSet({
    parent,
  }: {
    parent: PageParser,
  }): Promise<OddButtonParserSet> {
    return await SugarHouseOddButtonParserSet.create({ parent });
  }

  public async createOddButtonWrapper({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<OddButtonWrapper> {
    return await SugarHouseOddButtonWrapper.create({
      parent,
      oddButton,
    });
  }

  public async createDbGameConnection({
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<DbGameConnection> {
    return await SugarHouseDbGameConnection.create({ parent });
  }

  public async createDbStatisticConnection({
    parent,
    game,
  }: {
    parent: OddButtonParser,
    game: GameWithTeams,
  }): Promise<DbStatisticConnection> {
    return await SugarHouseDbStatisticConnection.create({
      parent,
      game,
    });
  }
}