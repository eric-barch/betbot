import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { draftKings, mlb } from '@/init-data';

export class DraftKingsMlbGamesPageParser extends PageParser {
  private constructor() {
    super({
      exchangeInitData: draftKings,
      leagueInitData: mlb,
      url: 'https://sportsbook.draftkings.com/leagues/baseball/mlb?category=game-lines&subcategory=game',
    });
  }

  public static async create(): Promise<DraftKingsMlbGamesPageParser> {
    const pageParser = new DraftKingsMlbGamesPageParser();
    await pageParser.init();
    return pageParser;
  }
}