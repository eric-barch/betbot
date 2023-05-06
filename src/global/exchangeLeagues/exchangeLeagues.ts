import * as db from '../../db';

export async function init() {
    const exchanges = await db.Exchange.findAll();
    const leagues = await db.League.findAll();

    for (const exchange of exchanges) {
        for (const league of leagues) {

        }
    }
}