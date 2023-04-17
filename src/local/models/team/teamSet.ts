import { Team } from './team';

export class TeamSet extends Set<Team> {
    public find({
        name,
    }: {
        name: string,
    }) {
        const nameLowerCase = name.toLowerCase();

        for (const team of this) {
            const teamIdentifier = team.identifierFull.toLowerCase();

            if (nameLowerCase.includes(teamIdentifier)) {
                return team;
            }
        }

        throw new Error(`Did not find team matching \"${name}\"`);
    }
}