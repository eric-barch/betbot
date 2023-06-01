import { prisma } from './prisma-client';
import { Game, League, Team } from '@prisma/client';

export class DbUtilityFunctions {
  public static async findOrCreateDbGame({
    awayTeam,
    homeTeam,
    startDate,
  }: {
    awayTeam: Team,
    homeTeam: Team,
    startDate: Date,
  }): Promise<Game> {
    const startDateToleranceInHours = 3;
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
        }
      })
    }

    return game;
  }

  public static async findDbTeam({
    unformattedName,
    league,
  }: {
    unformattedName: string,
    league: League,
  }): Promise<Team> {
    //TODO: This is so inefficient.
    const leagueTeams = await prisma.team.findMany({
      where: {
        leagueId: league.id,
      }
    });

    for (const team of leagueTeams) {
      const regex = new RegExp(`\\b${team.identifierFull}\\b`, 'i');

      if (regex.test(unformattedName)) {
        return team;
      }
    }

    throw new Error(`Did not find matching team.`);
  }
}