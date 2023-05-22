import { allExchangeLeagues } from '../exchange-leagues';
import { allPageTypes } from '../page-types';
import { IGlobal } from '../i-global';

import * as db from '../../db';

class AllExchangeLeaguePageTypes implements IGlobal<db.models.ExchangeLeaguePageType> {
    private wrappedActive: Array<db.models.ExchangeLeaguePageType>;

    constructor() {
        this.wrappedActive = new Array<db.models.ExchangeLeaguePageType>;
    }

    public async init(): Promise<Array<db.models.ExchangeLeaguePageType>> {
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
        exchangeLeague: db.models.ExchangeLeague,
        pageType: db.models.PageType,
    }): Promise<db.models.ExchangeLeaguePageType> {
        const exchangeLeagueId = exchangeLeague.id;
        const pageTypeId = pageType.id;
    
        const [exchangeLeaguePageType, created] = await db.models.ExchangeLeaguePageType.findOrCreate({
            where: {
                exchangeLeagueId,
                pageTypeId,
            },
            defaults: {
                exchangeLeagueId,
                pageTypeId,
            }
        });

        this.wrappedActive.push(exchangeLeaguePageType);
    
        return exchangeLeaguePageType;
    }

    get active(): Array<db.models.ExchangeLeaguePageType> {
        return this.wrappedActive;
    }
}

export const allExchangeLeaguePageTypes = new AllExchangeLeaguePageTypes();