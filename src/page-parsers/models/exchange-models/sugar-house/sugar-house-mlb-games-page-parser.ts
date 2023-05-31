import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { sugarHouse, mlb } from '@/init-data';

export class SugarHouseMlbGamesPageParser extends PageParser {
  private constructor() {
    super({
      exchangeInitData: sugarHouse,
      leagueInitData: mlb,
      url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home',
    });
  }

  public static async create(): Promise<SugarHouseMlbGamesPageParser> {
    const pageParser = new SugarHouseMlbGamesPageParser();
    await pageParser.init();
    return pageParser;
  }
}