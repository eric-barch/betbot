import { League, Team } from '@prisma/client';

import { prisma } from '@/db';

export class TeamService {
  public static async findByUnformattedNameAndLeague({
    unformattedName,
    league,
  }: {
    unformattedName: string,
    league: League,
  }): Promise<Team> {
    unformattedName = unformattedName.replace(/[^a-zA-Z0-9]/g, ' ');

    const leagueTeams = await prisma.team.findMany({
      where: {
        leagueId: league.id,
      }
    });

    if (leagueTeams.length < 1) {
      throw new Error(`No teams found for league ${league.name}`);
    }

    const foundTeam = await Promise.any(leagueTeams.map((team) => {
      return new Promise<Team>((resolve, reject) => {
        const regex = new RegExp(`\\b${team.identifierFull}\\b`, 'i');

        if (regex.test(unformattedName)) {
          resolve(team);
        } else {
          reject();
        }
      });
    })).catch((error) => {
      throw new Error(`No team found for unformattedName:${unformattedName}, league: ` +
        `${league.name}`);
    });

    return foundTeam!;
  }
}