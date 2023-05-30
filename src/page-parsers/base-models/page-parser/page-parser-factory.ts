import { PageParser } from './page-parser';
import * as exchangeModels from '../../exchange-models';

export class PageParserFactory {
  public static async create({
    url,
  }: {
    url: string,
  }): Promise<PageParser> {
    switch (url) {
      case 'https://sportsbook.draftkings.com/leagues/baseball/mlb?category=game-lines&subcategory=game':
        return await exchangeModels.DraftKingsMlbGamesPageParser.create();
      case 'https://sportsbook.fanduel.com/navigation/mlb':
        return await exchangeModels.FanDuelMlbGamesPageParser.create();
      case 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home':
        return await exchangeModels.SugarHouseMlbGamesPageParser.create();
      default:
        throw new Error(`Did not find matching Page Parser.`);
    }
  }
}