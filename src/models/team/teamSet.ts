import * as models from '..';

export class TeamSet extends Set<models.Team> {

    add(team: models.Team): this {
        return super.add(team);
    }

    public getTeamByNameString({
        string,
    }: {
        string: string,
    }) {
        for (const team of this) {
            if (team.matchesByNameString({string: string,})) {
                return team;
            }
        }

        throw new Error(`${this.constructor.name}.${this.getTeamByNameString.name} failed. Did not find team matching name string.`);
    }
    
}