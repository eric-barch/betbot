import { Team } from './team';

export class TeamSet extends Set<Team> {
    public find({
        name,
    }: {
        name: string,
    }) {
        for (const team of this) {
            if (team.matches({ name: name })) {
                return team;
            }
        }

        throw new Error(`Did not find team matching name string ${this.constructor.name}.${this.find.name}.`);
    }
}