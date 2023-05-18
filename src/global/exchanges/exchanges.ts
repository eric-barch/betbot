import * as db from '../../db/_index';

export let draftKings: db.models.Exchange;
export let fanDuel: db.models.Exchange;
export let sugarHouse: db.models.Exchange;

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
}): Promise<db.models.Exchange> {
    const [exchange, created] = await db.models.Exchange.findOrCreate({
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