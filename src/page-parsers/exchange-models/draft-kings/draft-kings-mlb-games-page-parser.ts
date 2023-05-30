import { PageParser } from '../../base-models';

export class DraftKingsMlbGamesPageParser extends PageParser {
  private constructor() {
    super({ url: 'https://sportsbook.draftkings.com/leagues/baseball/mlb?category=game-lines&subcategory=game' });
  }

  public static async create(): Promise<DraftKingsMlbGamesPageParser> {
    const pageParser = new DraftKingsMlbGamesPageParser();
    await pageParser.connectToWebpage();
    return pageParser;
  }
}