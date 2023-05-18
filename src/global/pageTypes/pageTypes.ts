import * as db from '../../db';

export let gamesPage: db.models.PageType;

export async function init() {
    console.log();

    gamesPage = await initPageType({
        name: 'games',
    })
}

async function initPageType({
    name,
}: {
    name: string,
}): Promise<db.models.PageType> {
    const [pageType, created] = await db.models.PageType.findOrCreate({
        where: {
            name,
        },
        defaults: {
            name,
        }
    });

    console.log(`'${name}' PageType initialized.`);

    return pageType;
}