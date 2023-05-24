import { allExchangeLeagues } from '../all-exchange-leagues';
import { allPageTypes } from '../all-page-types';
import { IGlobal } from '../i-global';

import * as db from '../../db';

class AllExchangeLeaguePageTypes implements IGlobal<db.models.Page> {
  private wrappedActive: Array<db.models.Page>;

  constructor() {
    this.wrappedActive = new Array<db.models.Page>();
  }

  public async init(): Promise<Array<db.models.Page>> {
    const exchangeLeagues = allExchangeLeagues.active;
    const pageTypes = allPageTypes.active;

    for (const exchangeLeague of exchangeLeagues) {
      for (const pageType of pageTypes) {
        await this.initExchangeLeaguePage({
          exchangeLeague,
          pageType,
        });
      }
    }

    return this.wrappedActive;
  }

  private async initExchangeLeaguePage({
    exchangeLeague,
    pageType,
  }: {
    exchangeLeague: db.models.ExchangeLeague;
    pageType: db.models.PageType;
  }): Promise<db.models.Page> {
    const exchangeLeagueId = exchangeLeague.id;
    const pageTypeId = pageType.id;

    const [exchangeLeaguePageType, created] = await db.models.Page.findOrCreate({
      where: {
        exchangeLeagueId,
        pageTypeId,
      },
      defaults: {
        exchangeLeagueId,
        pageTypeId,
      },
    });

    this.wrappedActive.push(exchangeLeaguePageType);

    return exchangeLeaguePageType;
  }

  get active(): Array<db.models.Page> {
    return this.wrappedActive;
  }
}

export const allExchangeLeaguePageTypes = new AllExchangeLeaguePageTypes();
