import * as global from '../../global';
import * as models from '../../models';

export class TeamSet extends Set<models.Team> {
    public async initialize() {
        for (const team of this) {
            await team.initialize();
        }
    }

    add(team: models.Team): this {
        if (global.allTeams !== undefined) {
            if (this === global.allTeams) {
                // Some code to add to or update MySQL.
            } else {
                global.allTeams.add(team);
            }
        }

        return super.add(team);
    }

    public getTeamByNameString({
        nameString,
    }: {
        nameString: string,
    }) {
        for (const team of this) {
            if (team.matchesByNameString({nameString: nameString,})) {
                return team;
            }
        }

        throw new Error(`${this.constructor.name}.${this.getTeamByNameString.name} failed. Did not find team matching name string.`);
    }
}