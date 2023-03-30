import * as models from '../../models';

export class TeamSet extends Set<models.Team> {
    public async initialize() {
        for (const team of this) {
            await team.initialize();
        }
    }

    add(team: models.Team): this {
        if (this !== models.allTeams) {
            models.allTeams.add(team);
        }

        return super.add(team);
    }

    public getTeamByName({
        string,
    }: {
        string: string,
    }) {
        for (const team of this) {
            if (team.matchesByNameString({string: string,})) {
                return team;
            }
        }

        throw new Error(`${this.constructor.name}.${this.getTeamByName.name} failed. Did not find team matching name string.`);
    }
}