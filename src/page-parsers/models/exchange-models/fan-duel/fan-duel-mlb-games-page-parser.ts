import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';

export class FanDuelMlbGamesPageParser extends PageParser {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<FanDuelMlbGamesPageParser> {
    const pageParser = new FanDuelMlbGamesPageParser({ pageParserInitData });
    return await pageParser.init();
  }
}