import * as db from '../../db';
import * as global from '../../global';

export let draftKingsMlb: db.ExchangeLeague;
export let draftKingsNba: db.ExchangeLeague;
export let draftKingsNfl: db.ExchangeLeague;

export let fanDuelMlb: db.ExchangeLeague;
export let fanDuelNba: db.ExchangeLeague;
export let fanDuelNfl: db.ExchangeLeague;

export let sugarHouseMlb: db.ExchangeLeague;
export let sugarHouseNba: db.ExchangeLeague;
export let sugarHouseNfl: db.ExchangeLeague;

export async function init() {
    draftKingsMlb = await initExchangeLeague({
        exchange: global.exchanges.draftKings,
        league: global.leagues.mlb,
        urlExtension: 'leagues/baseball/mlb',
    });

    draftKingsNba = await initExchangeLeague({
        exchange: global.exchanges.draftKings,
        league: global.leagues.nba,
        urlExtension: 'leagues/basketball/nba',
    });

    draftKingsNfl = await initExchangeLeague({
        exchange: global.exchanges.draftKings,
        league: global.leagues.nfl,
        urlExtension: 'leagues/football/nfl',
    });

    fanDuelMlb = await initExchangeLeague({
        exchange: global.exchanges.fanDuel,
        league: global.leagues.mlb,
        urlExtension: 'navigation/mlb',
    });

    fanDuelNba = await initExchangeLeague({
        exchange: global.exchanges.fanDuel,
        league: global.leagues.nba,
        urlExtension: 'navigation/nba',
    });

    fanDuelNfl = await initExchangeLeague({
        exchange: global.exchanges.fanDuel,
        league: global.leagues.nfl,
        urlExtension: 'navigation/nfl',
    });

    sugarHouseMlb = await initExchangeLeague({
        exchange: global.exchanges.sugarHouse,
        league: global.leagues.mlb,
        urlExtension: '&group=1000093616&type=matches',
    });

    sugarHouseNba = await initExchangeLeague({
        exchange: global.exchanges.sugarHouse,
        league: global.leagues.nba,
        urlExtension: '&group=1000093652&type=matches',
    });

    sugarHouseNfl = await initExchangeLeague({
        exchange: global.exchanges.sugarHouse,
        league: global.leagues.nfl,
        urlExtension: '&group=1000093656&type=matches',
    });
}

async function initExchangeLeague({
    exchange,
    league,
    urlExtension,
}: {
    exchange: db.Exchange,
    league: db.League,
    urlExtension: string,
}): Promise<db.ExchangeLeague> {
    const exchangeId = exchange.id;
    const leagueId = league.id;

    const [exchangeLeague, created] = await db.ExchangeLeague.findOrCreate({
        where: {
            exchangeId: exchangeId,
            leagueId: leagueId,
        },
        defaults: {
            urlExtension: urlExtension,
        }
    });

    if (!created) {
        await exchangeLeague.update({
            urlExtension: urlExtension,
        });
    }

    return exchangeLeague;
}