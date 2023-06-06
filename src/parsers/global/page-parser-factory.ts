import {
  PageParserInitData, draftKings,
  gamesPageType,
  mlb, nba
} from '@/config/init-data';
import { DraftKingsMlbGamesPageParser, DraftKingsNbaGamesPageParser, PageParser } from '@/parsers';

export class PageParserFactory {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<PageParser> {
    if (pageParserInitData.matches({
      exchangeInitData: draftKings,
      leagueInitData: mlb,
      pageTypeInitData: gamesPageType,
    })) {
      return await DraftKingsMlbGamesPageParser.create();
    } else if (pageParserInitData.matches({
      exchangeInitData: draftKings,
      leagueInitData: nba,
      pageTypeInitData: gamesPageType,
    })) {
      return await DraftKingsNbaGamesPageParser.create();
    }

    throw new Error(`Did not find matching Page Parser.`);
  }
}