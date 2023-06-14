import { Game, League, Team } from '@prisma/client';

import { prisma } from './prisma-client';

export class DbUtilityFunctions {
  public static async findOrCreateGameByMatchupAndStartDate({
    awayTeam,
    homeTeam,
    startDate,
  }: {
    awayTeam: Team,
    homeTeam: Team,
    startDate: Date,
  }): Promise<Game> {
    const startDateToleranceInHours = 2;
    const startDateToleranceInMilliseconds = startDateToleranceInHours * 60 * 60 * 1000;

    const toleranceBeforeStartDate = new Date(startDate.getTime() - startDateToleranceInMilliseconds);
    const toleranceAfterStartDate = new Date(startDate.getTime() + startDateToleranceInMilliseconds);

    let game: Game;

    try {
      game = await prisma.game.findFirstOrThrow({
        where: {
          awayTeamId: awayTeam.id,
          homeTeamId: homeTeam.id,
          AND: [
            { startDate: { gte: toleranceBeforeStartDate } },
            { startDate: { lte: toleranceAfterStartDate } },
          ],
        }
      });
    } catch (e) {
      game = await prisma.game.create({
        data: {
          awayTeam: { connect: { id: awayTeam.id } },
          homeTeam: { connect: { id: homeTeam.id } },
          startDate,
          active: true,
        }
      })
    }

    return game;
  }

  public static async findTeamByUnformattedNameAndLeague({
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

    const foundTeam = await Promise.any(leagueTeams.map((team) => {
      return new Promise<Team>((resolve, reject) => {
        const regex = new RegExp(`\\b${team.identifierFull}\\b`, 'i');

        if (regex.test(unformattedName)) {
          resolve(team);
        } else {
          reject();
        }
      });
    }));

    return foundTeam;
  }
}