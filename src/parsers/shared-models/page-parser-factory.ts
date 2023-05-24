import { PageParser } from './page-parser';
import { PageParserKey } from './page-parser-key';

import * as db from '../../db';
import * as exchangeModels from '../exchange-models';
import * as global from '../../global';

export class PageParserFactory {
  public static async getParser({
    exchangeId,
    leagueId,
    pageTypeId,
    sequelizePage,
  }: {
    exchangeId: number;
    leagueId: number;
    pageTypeId: number;
    sequelizePage: db.models.Page;
  }): Promise<PageParser> {
    const parserKey = new PageParserKey({
      exchangeId,
      leagueId,
      pageTypeId,
    });

    let parser: PageParser;

    if (
      parserKey.matches({
        exchangeId: global.allExchanges.draftKings.id,
        leagueId: global.allLeagues.mlb.id,
        pageTypeId: global.allPageTypes.games.id,
      })
    ) {
      parser = new exchangeModels.DraftKingsMlbGamesPageParser();
    } else if (
      parserKey.matches({
        exchangeId: global.allExchanges.fanDuel.id,
        leagueId: global.allLeagues.mlb.id,
        pageTypeId: global.allPageTypes.games.id,
      })
    ) {
      parser = new exchangeModels.FanDuelMlbGamesPageParser();
    } else if (
      parserKey.matches({
        exchangeId: global.allExchanges.sugarHouse.id,
        leagueId: global.allLeagues.mlb.id,
        pageTypeId: global.allPageTypes.games.id,
      })
    ) {
      parser = new exchangeModels.SugarHouseMlbGamesPageParser();
    } else if (
      parserKey.matches({
        exchangeId: global.allExchanges.draftKings.id,
        leagueId: global.allLeagues.nba.id,
        pageTypeId: global.allPageTypes.games.id,
      })
    ) {
      parser = new exchangeModels.DraftKingsNbaGamesPageParser();
    } else if (
      parserKey.matches({
        exchangeId: global.allExchanges.fanDuel.id,
        leagueId: global.allLeagues.nba.id,
        pageTypeId: global.allPageTypes.games.id,
      })
    ) {
      parser = new exchangeModels.FanDuelNbaGamesPageParser();
    } else if (
      parserKey.matches({
        exchangeId: global.allExchanges.sugarHouse.id,
        leagueId: global.allLeagues.nba.id,
        pageTypeId: global.allPageTypes.games.id,
      })
    ) {
      parser = new exchangeModels.SugarHouseNbaGamesPageParser();
    } else {
      throw new Error(`Did not find matching parser.`);
    }

    parser.sequelizePage = sequelizePage;

    return parser;
  }
}
