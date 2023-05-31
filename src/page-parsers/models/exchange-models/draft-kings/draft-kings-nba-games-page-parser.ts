import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';

export class DraftKingsNbaGamesPageParser extends PageParser {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<DraftKingsNbaGamesPageParser> {
    const pageParser = new DraftKingsNbaGamesPageParser({ pageParserInitData });
    return await pageParser.init();
  }
}