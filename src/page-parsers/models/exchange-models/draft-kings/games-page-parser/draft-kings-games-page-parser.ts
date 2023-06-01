import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { PageParserInitData } from '@/init-data';
import { Game } from '@prisma/client';
import { JsonGamesParser } from './json-games-parser';
import { DocumentGamesParser } from './document-games-parser';

export class DraftKingsGamesPageParser extends PageParser {
  private jsonGamesParser: JsonGamesParser;
  private documentGamesParser: DocumentGamesParser;

  constructor({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }) {
    super({ pageParserInitData });
    this.jsonGamesParser = new JsonGamesParser({ pageParser: this });
    this.documentGamesParser = new DocumentGamesParser({ pageParser: this });
  }

  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<DraftKingsGamesPageParser> {
    const pageParser = new DraftKingsGamesPageParser({ pageParserInitData });
    await pageParser.init();
    return pageParser;
  }

  protected async updateGames(): Promise<Array<Game>> {
    // Determine the list of games presented on the page.
    await this.jsonGamesParser.ensureGamesInDb();
    return await this.documentGamesParser.getGames();
  }

  // protected updateStatistics(): Promise<Array<Statistic>> {
  //   // Determine the list of statistics presented for each game (from column headers).
  // }


}