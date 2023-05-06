import * as db from '../../db';

export let mlb: db.League;
export let nba: db.League;
export let nfl: db.League;

export async function init() {
    mlb = await initLeague({
        name: 'Major League Baseball',
        abbreviation: 'MLB',
    });

    nba = await initLeague({
        name: 'National Basketball Association',
        abbreviation: 'NBA',
    });

    nfl = await initLeague({
        name: 'National Football League',
        abbreviation: 'NFL',
    });
}

async function initLeague({
    name,
    abbreviation,
}: {
    name: string,
    abbreviation: string,
}): Promise<db.League> {
    const [league, created] = await db.League.findOrCreate({
        where: {
            name: name,
        },
        defaults: {
            name: name,
            abbreviation: abbreviation,
        }
    });

    if (!created) {
        await league.update({
            abbreviation: abbreviation,
        });
    }

    return league;
}