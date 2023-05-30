import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { fanDuel, mlb } from '@/init-data';

export class FanDuelMlbGamesPageParser extends PageParser {
  private constructor() {
    super({
      exchangeInitData: fanDuel,
      leagueInitData: mlb,
      url: 'https://sportsbook.fanduel.com/navigation/mlb',
    });
  }

  public static async create(): Promise<FanDuelMlbGamesPageParser> {
    const pageParser = new FanDuelMlbGamesPageParser();
    await pageParser.init();
    return pageParser;
  }
}