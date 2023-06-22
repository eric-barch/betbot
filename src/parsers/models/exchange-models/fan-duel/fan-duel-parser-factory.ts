import { SpecializedJsonGamesParser, SpecializedOddButtonParserSet, PageParser } from '../../common-models';
import { ParserFactory } from '../../common-models/parser-factory';

import { FanDuelJsonGamesParser, FanDuelOddButtonParserSet } from './fan-duel-page-parser';

export class FanDuelParserFactory implements ParserFactory {
  public async createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser> {
    return await FanDuelJsonGamesParser.create({ parentPageParser });
  }

  public async createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedOddButtonParserSet> {
    return await FanDuelOddButtonParserSet.create({ parentPageParser });
  }
}