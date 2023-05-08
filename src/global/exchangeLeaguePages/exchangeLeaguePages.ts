import * as db from '../../db';
import * as global from '../../global';

export let draftKingsMlbGames: db.ExchangeLeaguePage;
export let draftKingsNbaGames: db.ExchangeLeaguePage;
export let draftKingsNflGames: db.ExchangeLeaguePage;

export let fanDuelMlbGames: db.ExchangeLeaguePage;
export let fanDuelNbaGames: db.ExchangeLeaguePage;
export let fanDuelNflGames: db.ExchangeLeaguePage;

export let sugarHouseMlbGames: db.ExchangeLeaguePage;
export let sugarHouseNbaGames: db.ExchangeLeaguePage;
export let sugarHouseNflGames: db.ExchangeLeaguePage;

export async function init() {
    draftKingsMlbGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.draftKingsMlb,
        pageName: 'games',
        urlExtension: '?category=game-lines&subcategory=game',
    });

    draftKingsNbaGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.draftKingsNba,
        pageName: 'games',
        urlExtension: '?category=game-lines&subcategory=game',
    });

    draftKingsNflGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.draftKingsNfl,
        pageName: 'games',
        urlExtension: '?category=game-lines&subcategory=game',
    });

    fanDuelMlbGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.fanDuelMlb,
        pageName: 'games',
        urlExtension: null,
    });

    fanDuelNbaGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.fanDuelNba,
        pageName: 'games',
        urlExtension: null,
    });

    fanDuelNflGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.fanDuelNfl,
        pageName: 'games',
        urlExtension: null,
    });

    sugarHouseMlbGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.sugarHouseMlb,
        pageName: 'games',
        urlExtension: '&type=matches',
    });

    sugarHouseNbaGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.sugarHouseNba,
        pageName: 'games',
        urlExtension: '&type=matches',
    });

    sugarHouseNflGames = await initExchangeLeaguePage({
        exchangeLeague: global.exchangeLeagues.sugarHouseNfl,
        pageName: 'games',
        urlExtension: '&type=matches',
    });
}

async function initExchangeLeaguePage({
    exchangeLeague,
    pageName,
    urlExtension,
}: {
    exchangeLeague: db.ExchangeLeague,
    pageName: string,
    urlExtension: string | null,
}): Promise<db.ExchangeLeaguePage> {
    const exchangeLeagueId = exchangeLeague.id;

    const [exchangeLeaguePage, created] = await db.ExchangeLeaguePage.findOrCreate({
        where: {
            exchangeLeagueId,
            pageName,
        },
        defaults: {
            exchangeLeagueId,
            pageName,
            urlExtension,
        }
    });

    if (!created) {
        await exchangeLeaguePage.update({
            urlExtension,
        });
    }

    return exchangeLeaguePage;
}