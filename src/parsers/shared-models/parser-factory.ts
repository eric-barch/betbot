import { Parser } from './parser';
import { ParserKey } from './parser-key';

import * as exchangeModels from '../exchange-models';
import * as global from '../../global';

export class ParserFactory {
  public static async getParser({
    exchangeId,
    leagueId,
    pageTypeId,
  }: {
    exchangeId: number;
    leagueId: number;
    pageTypeId: number;
  }): Promise<Parser> {
    const parserKey = new ParserKey({
      exchangeId,
      leagueId,
      pageTypeId,
    });

    let parser: Parser;

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

    return parser;
  }
}
