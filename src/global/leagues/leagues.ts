import * as db from '../../db';

export let mlb: db.models.League;
export let nba: db.models.League;
export let nfl: db.models.League;

export async function init() {
    console.log();

    // mlb = await initLeague({
    //     name: 'Major League Baseball',
    //     abbreviation: 'MLB',
    // });

    nba = await initLeague({
        name: 'National Basketball Association',
        abbreviation: 'NBA',
    });

    // nfl = await initLeague({
    //     name: 'National Football League',
    //     abbreviation: 'NFL',
    // });
}

async function initLeague({
    name,
    abbreviation,
}: {
    name: string,
    abbreviation: string,
}): Promise<db.models.League> {
    const [league, created] = await db.models.League.findOrCreate({
        where: {
            name,
        },
        defaults: {
            name,
            abbreviation,
        }
    });

    if (!created) {
        await league.update({
            abbreviation: abbreviation,
        });
    }

    console.log(`${abbreviation} initialized.`);

    return league;
}