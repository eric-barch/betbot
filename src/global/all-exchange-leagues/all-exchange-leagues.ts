import { allExchanges } from '../all-exchanges';
import { allLeagues } from '../all-leagues';
import { IGlobal } from '../i-global';

import * as db from '../../db';

class AllExchangeLeagues implements IGlobal<db.models.ExchangeLeague> {
  private wrappedActive: Array<db.models.ExchangeLeague>;

  constructor() {
    this.wrappedActive = new Array<db.models.ExchangeLeague>();
  }

  public async init(): Promise<Array<db.models.ExchangeLeague>> {
    const exchanges = allExchanges.active;
    const leagues = allLeagues.active;

    for (const exchange of exchanges) {
      for (const league of leagues) {
        await this.initExchangeLeague({
          exchange,
          league,
        });
      }
    }

    return this.wrappedActive;
  }

  private async initExchangeLeague({
    exchange,
    league,
  }: {
    exchange: db.models.Exchange;
    league: db.models.League;
  }): Promise<db.models.ExchangeLeague> {
    const exchangeId = exchange.id;
    const leagueId = league.id;

    const [exchangeLeague, created] = await db.models.ExchangeLeague.findOrCreate({
      where: {
        exchangeId,
        leagueId,
      },
      defaults: {
        exchangeId,
        leagueId,
      },
    });

    this.wrappedActive.push(exchangeLeague);

    return exchangeLeague;
  }

  get active(): Array<db.models.ExchangeLeague> {
    return this.wrappedActive;
  }
}

export const allExchangeLeagues = new AllExchangeLeagues();
