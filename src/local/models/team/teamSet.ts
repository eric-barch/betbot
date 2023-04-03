import * as localModels from '../../../local/models';

export class TeamSet extends Set<localModels.Team> {
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

        throw new Error(`Did not find team matching name string ${this.constructor.name}.${this.getTeamByNameString.name}.`);
    }
}