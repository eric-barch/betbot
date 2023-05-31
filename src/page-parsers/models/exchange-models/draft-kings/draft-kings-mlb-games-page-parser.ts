import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';

export class DraftKingsMlbGamesPageParser extends PageParser {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<DraftKingsMlbGamesPageParser> {
    const pageParser = new DraftKingsMlbGamesPageParser({ pageParserInitData });
    return await pageParser.init();
  }
}