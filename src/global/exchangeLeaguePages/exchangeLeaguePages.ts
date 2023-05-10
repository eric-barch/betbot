import * as db from '../../db';

export async function init() {
    console.log();

    const exchangeLeagues = await db.ExchangeLeague.findAll();
    const pageTypes = await db.PageType.findAll();

    for (const exchangeLeague of exchangeLeagues) {
        for (const pageType of pageTypes) {
            await initExchangeLeaguePage({
                exchangeLeague,
                pageType,
            });
        }
    }
}

async function initExchangeLeaguePage({
    exchangeLeague,
    pageType,
}: {
    exchangeLeague: db.ExchangeLeague,
    pageType: db.PageType,
}): Promise<db.ExchangeLeaguePage> {
    const exchangeLeagueId = exchangeLeague.id;
    const pageTypeId = pageType.id;

    const [exchangeLeaguePage, created] = await db.ExchangeLeaguePage.findOrCreate({
        where: {
            exchangeLeagueId,
            pageTypeId,
        },
        defaults: {
            exchangeLeagueId,
            pageTypeId,
        }
    });

    const exchangeName = (await exchangeLeague.getExchange()).name;
    const leagueAbbreviation = (await exchangeLeague.getLeague()).abbreviation;

    console.log(`${exchangeName} ${leagueAbbreviation} '${pageType.name}' ExchangeLeaguePage initialized.`);

    return exchangeLeaguePage;
}