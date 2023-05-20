import * as db from '../../db';

export let mlb: db.models.League;
export let nba: db.models.League;
export let nfl: db.models.League;

export class AllLeagues {
    public static async init() {
        console.log();
    
        // mlb = await initLeague({
        //     name: 'Major League Baseball',
        //     abbreviation: 'MLB',
        // });
    
        nba = await this.initLeague({
            name: 'National Basketball Association',
            abbreviation: 'NBA',
        });
    
        // nfl = await initLeague({
        //     name: 'National Football League',
        //     abbreviation: 'NFL',
        // });
    }

    private static async initLeague({
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
}