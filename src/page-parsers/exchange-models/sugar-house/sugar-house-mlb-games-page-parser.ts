import { PageParser } from '../../base-models';

export class SugarHouseMlbGamesPageParser extends PageParser {
  private constructor() {
    super({ url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home' });
  }

  public static async create(): Promise<SugarHouseMlbGamesPageParser> {
    const pageParser = new SugarHouseMlbGamesPageParser();
    await pageParser.connectToWebpage();
    return pageParser;
  }
}