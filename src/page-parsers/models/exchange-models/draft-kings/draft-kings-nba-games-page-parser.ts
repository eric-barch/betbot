import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { draftKings, nba } from '@/init-data';

export class DraftKingsNbaGamesPageParser extends PageParser {
  private constructor() {
    super({
      exchangeInitData: draftKings,
      leagueInitData: nba,
      url: 'https://sportsbook.draftkings.com/leagues/basketball/nba?category=game-lines&subcategory=game',
    });
  }

  public static async create(): Promise<DraftKingsNbaGamesPageParser> {
    const pageParser = new DraftKingsNbaGamesPageParser();
    await pageParser.init();
    return pageParser;
  }
}