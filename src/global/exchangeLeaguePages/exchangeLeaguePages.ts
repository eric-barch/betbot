import * as db from '../../db/_index';

export async function init() {
    console.log();

    const exchangeLeagues = await db.models.ExchangeLeague.findAll();
    const pageTypes = await db.models.PageType.findAll();

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
    exchangeLeague: db.models.ExchangeLeague,
    pageType: db.models.PageType,
}): Promise<db.models.ExchangeLeaguePage> {
    const exchangeLeagueId = exchangeLeague.id;
    const pageTypeId = pageType.id;

    const [exchangeLeaguePage, created] = await db.models.ExchangeLeaguePage.findOrCreate({
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