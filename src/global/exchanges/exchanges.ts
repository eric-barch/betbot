import * as db from '../../db';

export let draftKings: db.Exchange;
export let fanDuel: db.Exchange;
export let sugarHouse: db.Exchange;

export async function init() {
    console.log();

    draftKings = await initExchange({
        name: 'DraftKings',
        baseUrl: 'https://sportsbook.draftkings.com/',
    });

    fanDuel = await initExchange({
        name: 'FanDuel',
        baseUrl: 'https://sportsbook.fanduel.com/',
    });

    sugarHouse = await initExchange({
        name: 'SugarHouse',
        baseUrl: 'https://ct.playsugarhouse.com/&page=sportsbook',
    })
}

async function initExchange({
    name,
    baseUrl,
}: {
    name: string,
    baseUrl: string,
}): Promise<db.Exchange> {
    const [exchange, created] = await db.Exchange.findOrCreate({
        where: {
            name,
        },
        defaults: {
            name,
            baseUrl,
        }
    });

    if (!created) {
        await exchange.update({
            baseUrl,
        });
    }

    console.log(`${name} initialized.`);

    return exchange;
}