import * as leagueTeams from './leagueTeams';
import * as models from '../../models';

export const allTeams = new models.TeamSet(leagueTeams.nba)