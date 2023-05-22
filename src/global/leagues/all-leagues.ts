import * as db from '../../db';

class AllLeagues {
    private wrappedMlb: db.models.League | undefined;
    private wrappedNba: db.models.League | undefined;
    private wrappedNfl: db.models.League | undefined;

    private wrappedActive: Array<db.models.League>;

    constructor() {
        this.wrappedActive = new Array<db.models.League>;
    }

    public async init() {
        this.wrappedMlb = await this.initLeague({
            name: 'Major League Baseball',
            abbreviation: 'MLB',
        });
    
        this.wrappedNba = await this.initLeague({
            name: 'National Basketball Association',
            abbreviation: 'NBA',
        });
    
        this.wrappedNfl = await this.initLeague({
            name: 'National Football League',
            abbreviation: 'NFL',
        });
    }

    private async initLeague({
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

        this.wrappedActive.push(league);
    
        return league;
    }

    get mlb(): db.models.League {
        if (!this.wrappedMlb) {
            throw new Error(`wrappedMlb is undefined.`);
        }

        return this.wrappedMlb;
    }

    get nba(): db.models.League {
        if (!this.wrappedNba) {
            throw new Error(`wrappedNba is undefined.`);
        }

        return this.wrappedNba;
    }

    get nfl(): db.models.League {
        if (!this.wrappedNfl) {
            throw new Error(`wrappedNfl is undefined`);
        }

        return this.wrappedNfl;
    }

    get active(): Array<db.models.League> {
        return this.wrappedActive;
    }
}

export const allLeagues = new AllLeagues();