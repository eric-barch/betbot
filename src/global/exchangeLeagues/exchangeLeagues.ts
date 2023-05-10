import * as db from '../../db';

export async function init() {
    console.log();

    const exchanges = await db.Exchange.findAll();
    const leagues = await db.League.findAll();

    for (const exchange of exchanges) {
        for (const league of leagues) {
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
    exchange: db.Exchange,
    league: db.League,
}): Promise<db.ExchangeLeague> {
    const exchangeId = exchange.id;
    const leagueId = league.id;

    const [exchangeLeague, created] = await db.ExchangeLeague.findOrCreate({
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