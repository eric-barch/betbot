import * as leagues from './leagues';
import * as localModels from '../../../local/models';

export const allTeams = new localModels.TeamSet();

export async function allTeamsInit(): Promise<void> {
    for (const team of leagues.nbaTeams) {
        const newTeam = await localModels.Team.create({
            regionFull: team.regionFull,
            regionAbbr: team.regionAbbr,
            identifierFull: team.identifierFull,
            identifierAbbr: team.identifierAbbr,
        });

        allTeams.add(newTeam);
    }
}