import * as db from '../../db';

export let gamesPage: db.PageType;

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
}): Promise<db.PageType> {
    const [pageType, created] = await db.PageType.findOrCreate({
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