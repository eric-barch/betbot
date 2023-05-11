import * as db from '../../db';

export let draftKings: db.Exchange;
export let fanDuel: db.Exchange;
export let sugarHouse: db.Exchange;

export async function init() {
    console.log();

    draftKings = await initExchange({
        name: 'DraftKings',
    });

    fanDuel = await initExchange({
        name: 'FanDuel',
    });

    sugarHouse = await initExchange({
        name: 'SugarHouse',
    })
}

async function initExchange({
    name,
}: {
    name: string,
}): Promise<db.Exchange> {
    const [exchange, created] = await db.Exchange.findOrCreate({
        where: {
            name,
        },
        defaults: {
            name,
        }
    });

    console.log(`${name} initialized.`);

    return exchange;
}