import { LeagueInitData } from '../leagues'
import { TeamInitData } from '../teams'

export class LeagueTeamsInitData {
  private wrappedLeague: LeagueInitData;
  private wrappedTeams: Array<TeamInitData>;

  public constructor({
    league,
    teams,
  }: {
    league: LeagueInitData,
    teams: Array<TeamInitData>,
  }) {
    this.wrappedLeague = league;
    this.wrappedTeams = teams;
  }

  public get league(): LeagueInitData {
    return this.wrappedLeague;
  }

  public get teams(): Array<TeamInitData> {
    return this.wrappedTeams;
  }
}