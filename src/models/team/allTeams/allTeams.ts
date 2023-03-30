import * as models from '../../../models';
import * as leagueTeams from './leagueTeams';

export const allTeams = new models.TeamSet(leagueTeams.nba)