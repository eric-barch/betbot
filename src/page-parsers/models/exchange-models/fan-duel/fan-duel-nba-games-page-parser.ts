import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';

export class FanDuelNbaGamesPageParser extends PageParser {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<FanDuelNbaGamesPageParser> {
    const pageParser = new FanDuelNbaGamesPageParser({ pageParserInitData });
    return await pageParser.init();
  }
}