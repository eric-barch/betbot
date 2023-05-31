import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { sugarHouse, nba } from '@/init-data';

export class SugarHouseNbaGamesPageParser extends PageParser {
  private constructor() {
    super({
      exchangeInitData: sugarHouse,
      leagueInitData: nba,
      url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home',
    });
  }

  public static async create(): Promise<SugarHouseNbaGamesPageParser> {
    const pageParser = new SugarHouseNbaGamesPageParser();
    await pageParser.init();
    return pageParser;
  }
}