import { League } from '@prisma/client';
import { TeamInitData, mlbTeams, nbaTeams, nflTeams } from '@/config/init-data';

export class TeamsInitDataFactory {
  public static getLeagueTeams({
    league,
  }: {
    league: League,
  }): Array<TeamInitData> {
    switch (league.name) {
      case 'Major League Baseball':
        return mlbTeams;
      case 'National Basketball Association':
        return nbaTeams;
      case 'National Football League':
        return nflTeams;
      default:
        throw new Error(`Did not find matching league teams.`);
    }
  }
}