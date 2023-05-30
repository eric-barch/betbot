import { PageParser } from '../../base-models';

export class FanDuelMlbGamesPageParser extends PageParser {
  private constructor() {
    super({ url: 'https://sportsbook.fanduel.com/navigation/mlb' });
  }

  public static async create(): Promise<FanDuelMlbGamesPageParser> {
    const pageParser = new FanDuelMlbGamesPageParser();
    await pageParser.connectToWebpage();
    return pageParser;
  }
}