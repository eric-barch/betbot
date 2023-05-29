import { ITeamData } from './i-team-data';
import { mlbTeamData } from './mlb';
import { nbaTeamData } from './nba';
import { nflTeamData } from './nfl';

class TeamsDataByLeague {
  private wrappedMlb: Array<ITeamData>;
  private wrappedNba: Array<ITeamData>;
  private wrappedNfl: Array<ITeamData>;

  constructor() {
    this.wrappedMlb = mlbTeamData;
    this.wrappedNba = nbaTeamData;
    this.wrappedNfl = nflTeamData;
  }

  get mlb(): Array<ITeamData> {
    return this.wrappedMlb;
  }

  get nba(): Array<ITeamData> {
    return this.wrappedNba;
  }

  get nfl(): Array<ITeamData> {
    return this.wrappedNfl;
  }
}

export const teamsDataByLeague = new TeamsDataByLeague();