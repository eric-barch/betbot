import { allExchangeLeaguePageTypes } from '../all-pages';
import { IGlobal } from '../i-global';

import * as db from '../../db';
import * as parsers from '../../parsers';
import { allPageTypes } from '../all-page-types';

class AllGames implements IGlobal<db.models.Game> {
  private wrappedActive: Array<db.models.Game>;

  constructor() {
    this.wrappedActive = new Array<db.models.Game>();
  }

  public async init(): Promise<Array<db.models.Game>> {
    const exchangeLeagueGamePageTypes = allExchangeLeaguePageTypes.active.filter(
      (exchangeLeaguePageType) => exchangeLeaguePageType.pageTypeId === allPageTypes.games.id
    );

    for (const exchangeLeagueGamePageType of exchangeLeagueGamePageTypes) {
      const gamesPageParser = await exchangeLeagueGamePageType.getParser();

      if (!(gamesPageParser instanceof parsers.GamesPageParser)) {
        throw new Error(`gamesPageParser is not a GamesPageParser.`);
      }

      const exchangeLeagueGames = await gamesPageParser.getGames();

      for (const exchangeLeagueGame of exchangeLeagueGames) {
        this.wrappedActive.push(exchangeLeagueGame);
      }
    }

    return this.wrappedActive;
  }

  get active(): Array<db.models.Game> {
    return this.wrappedActive;
  }
}

export const allGames = new AllGames();
