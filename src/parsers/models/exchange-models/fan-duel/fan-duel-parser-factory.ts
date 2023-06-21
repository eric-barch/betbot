import { IJsonGamesParser, IOddButtonParserSet, PageParser } from '../../common-models';
import { IParserFactory } from '../../common-models/i-parser-factory';

import { FanDuelJsonGamesParser, FanDuelOddButtonParserSet } from './fan-duel-page-parser';

export class FanDuelParserFactory implements IParserFactory {
  public async createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<IJsonGamesParser> {
    return await FanDuelJsonGamesParser.create({ parentPageParser });
  }

  public async createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<IOddButtonParserSet> {
    return await FanDuelOddButtonParserSet.create({ parentPageParser });
  }
}