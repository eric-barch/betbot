import * as leagues from './leagues';
import { Team, TeamSet } from '../../../local/models/team';

export const allTeams = new TeamSet();

export async function initAllTeams(): Promise<void> {
    for (const team of leagues.nbaTeams) {
        const newTeam = await Team.create({
            regionFull: team.regionFull,
            regionAbbr: team.regionAbbr,
            identifierFull: team.identifierFull,
            identifierAbbr: team.identifierAbbr,
        });

        allTeams.add(newTeam);
    }
}