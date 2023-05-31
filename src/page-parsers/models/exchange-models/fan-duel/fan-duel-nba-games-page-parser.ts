import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { fanDuel, nba } from '@/init-data';

export class FanDuelNbaGamesPageParser extends PageParser {
  private constructor() {
    super({
      exchangeInitData: fanDuel,
      leagueInitData: nba,
      url: 'https://sportsbook.fanduel.com/navigation/nba',
    });
  }

  public static async create(): Promise<FanDuelNbaGamesPageParser> {
    const pageParser = new FanDuelNbaGamesPageParser();
    await pageParser.init();
    return pageParser;
  }
}