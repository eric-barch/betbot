import {
  PageParser, DraftKingsMlbGamesPageParser, FanDuelMlbGamesPageParser, SugarHouseMlbGamesPageParser, DraftKingsNbaGamesPageParser, FanDuelNbaGamesPageParser, SugarHouseNbaGamesPageParser
} from '@/page-parsers';

export class PageParserFactory {
  public static async create({
    url,
  }: {
    url: string,
  }): Promise<PageParser> {
    switch (url) {
      case 'https://sportsbook.draftkings.com/leagues/baseball/mlb?category=game-lines&subcategory=game':
        return await DraftKingsMlbGamesPageParser.create();
      case 'https://sportsbook.draftkings.com/leagues/basketball/nba?category=game-lines&subcategory=game':
        return await DraftKingsNbaGamesPageParser.create();
      case 'https://sportsbook.fanduel.com/navigation/mlb':
        return await FanDuelMlbGamesPageParser.create();
      case 'https://sportsbook.fanduel.com/navigation/nba':
        return await FanDuelNbaGamesPageParser.create();
      case 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home':
        return await SugarHouseMlbGamesPageParser.create();
      case 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home':
        return await SugarHouseNbaGamesPageParser.create();
      default:
        throw new Error(`Did not find matching Page Parser.`);
    }
  }
}