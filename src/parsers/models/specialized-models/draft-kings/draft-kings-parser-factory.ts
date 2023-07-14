import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import {
  DbGameConnection, DbStatisticConnection, OddButtonParser, OddButtonParserSet, OddButtonWrapper,
  PageParser, ParserFactory,
} from '@/parsers/models/common-models';
import {
  DraftKingsDbGameConnection, DraftKingsDbStatisticConnection, DraftKingsOddButtonParserSet,
  DraftKingsOddButtonWrapper,
} from '@/parsers/models/specialized-models/draft-kings';

export class DraftKingsParserFactory implements ParserFactory {
  public async createOddButtonParserSet({
    parent,
  }: {
    parent: PageParser,
  }): Promise<OddButtonParserSet> {
    return await DraftKingsOddButtonParserSet.create({ parent });
  }

  public async createOddButtonWrapper({
    parent,
    oddButton,
  }: {
    parent: OddButtonParser,
    oddButton: ElementHandle,
  }): Promise<OddButtonWrapper> {
    return await DraftKingsOddButtonWrapper.create({
      parent,
      oddButton,
    });
  }

  public async createDbGameConnection({
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<DbGameConnection> {
    return await DraftKingsDbGameConnection.create({ parent });
  }

  public async createDbStatisticConnection({
    parent,
    game,
  }: {
    parent: OddButtonParser,
    game: GameWithTeams,
  }): Promise<DbStatisticConnection> {
    return await DraftKingsDbStatisticConnection.create({
      parent,
      game,
    });
  }
}