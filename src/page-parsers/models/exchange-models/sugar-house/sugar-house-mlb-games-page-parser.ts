import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';

export class SugarHouseMlbGamesPageParser extends PageParser {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<SugarHouseMlbGamesPageParser> {
    const pageParser = new SugarHouseMlbGamesPageParser({ pageParserInitData });
    return await pageParser.init();
  }
}