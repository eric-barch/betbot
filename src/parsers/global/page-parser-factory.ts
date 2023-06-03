import {
  PageParserInitData, draftKings,
  gamesPageType,
  mlb, nba
} from '@/init-data';
import { DraftKingsGamesPageParser, PageParser } from '@/parsers';

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
      return await DraftKingsGamesPageParser.create({ pageParserInitData });
    } else if (pageParserInitData.matches({
      exchange: draftKings,
      league: nba,
      pageType: gamesPageType,
    })) {
      return await DraftKingsGamesPageParser.create({ pageParserInitData });
    }

    throw new Error(`Did not find matching Page Parser.`);
  }
}