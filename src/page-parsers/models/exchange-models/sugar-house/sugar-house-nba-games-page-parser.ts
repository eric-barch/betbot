import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';

export class SugarHouseNbaGamesPageParser extends PageParser {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<SugarHouseNbaGamesPageParser> {
    const pageParser = new SugarHouseNbaGamesPageParser({ pageParserInitData });
    return await pageParser.init();
  }
}