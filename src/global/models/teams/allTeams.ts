import * as leagues from './leagues';
import * as localModels from '../../../local';

class AllTeams extends localModels.TeamSet {
    public async init(): Promise<void> {
        for (const team of leagues.nbaTeams) {
            const newTeam = await localModels.Team.create({
                regionFull: team.regionFull,
                regionAbbr: team.regionAbbr,
                identifierFull: team.identifierFull,
                identifierAbbr: team.identifierAbbr,
                altNames: team.altNames,
            });
    
            this.add(newTeam);
        }
    }
}

export const allTeams = new AllTeams();