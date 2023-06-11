import { League } from '@prisma/client';

import { TeamInitData, mlbTeamsInitData, nbaTeamsInitData, nflTeamsInitData } from '@/setup/page-parser-init-data';

export class TeamsInitDataFactory {
  public static getLeagueTeams({
    league,
  }: {
    league: League,
  }): Array<TeamInitData> {
    switch (league.name) {
      case 'Major League Baseball':
        return mlbTeamsInitData;
      case 'National Basketball Association':
        return nbaTeamsInitData;
      case 'National Football League':
        return nflTeamsInitData;
      default:
        throw new Error(`Did not find matching league teams.`);
    }
  }
}