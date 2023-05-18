import * as db from '../../db/_index';
import * as global from '../_index';

export async function init() {
    console.log();

    const exchanges = await db.models.Exchange.findAll();
    const leagues = await db.models.League.findAll();

    for (const exchange of exchanges) {
        for (const league of leagues) {
            let urlSegment: string;

            if (exchange.id === global.exchanges.draftKings.id &&
                    league.id === global.leagues.nba.id) {
                
            }


            await initExchangeLeague({
                exchange,
                league,
            });
        }
    }
}

async function initExchangeLeague({
    exchange,
    league,
}: {
    exchange: db.models.Exchange,
    league: db.models.League,
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
        }
    });

    console.log(`${exchange.name} ${league.abbreviation} ExchangeLeague initialized.`);

    return exchangeLeague;
}