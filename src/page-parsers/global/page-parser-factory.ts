import {
  PageParser, DraftKingsMlbGamesPageParser, FanDuelMlbGamesPageParser,
  SugarHouseMlbGamesPageParser, DraftKingsNbaGamesPageParser, FanDuelNbaGamesPageParser,
  SugarHouseNbaGamesPageParser,
} from '@/page-parsers';
import {
  PageParserInitData, draftKings, fanDuel, sugarHouse, mlb, nba, nfl, gamesPageType
} from '@/init-data';

export class PageParserFactory {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<PageParser> {
    if (pageParserInitData.matches({
      exchange: draftKings,
      league: mlb,
      pageType: gamesPageType,
    })) {
      return await DraftKingsMlbGamesPageParser.create({ pageParserInitData });
    } else if (pageParserInitData.matches({
      exchange: draftKings,
      league: nba,
      pageType: gamesPageType,
    })) {
      return await DraftKingsNbaGamesPageParser.create({ pageParserInitData });
    } else if (pageParserInitData.matches({
      exchange: fanDuel,
      league: mlb,
      pageType: gamesPageType,
    })) {
      return await FanDuelMlbGamesPageParser.create({ pageParserInitData });
    } else if (pageParserInitData.matches({
      exchange: fanDuel,
      league: nba,
      pageType: gamesPageType,
    })) {
      return await FanDuelNbaGamesPageParser.create({ pageParserInitData });
    } else if (pageParserInitData.matches({
      exchange: sugarHouse,
      league: mlb,
      pageType: gamesPageType,
    })) {
      return await SugarHouseMlbGamesPageParser.create({ pageParserInitData });
    } else if (pageParserInitData.matches({
      exchange: sugarHouse,
      league: nba,
      pageType: gamesPageType,
    })) {
      return await SugarHouseNbaGamesPageParser.create({ pageParserInitData });
    }

    throw new Error(`Did not find matching Page Parser.`);
  }
}