import { Team } from '@prisma/client';

import { GameWithTeams, prisma } from '@/db';

export class GameService {
  public static async findOrCreateByMatchupAndStartDate({
    awayTeam,
    homeTeam,
    startDate,
  }: {
    awayTeam: Team,
    homeTeam: Team,
    startDate: Date,
  }): Promise<GameWithTeams> {
    const startDateToleranceInHours = 2;
    const startDateToleranceInMilliseconds = startDateToleranceInHours * 60 * 60 * 1000;

    const toleranceBeforeStartDate = new Date(startDate.getTime() - startDateToleranceInMilliseconds);
    const toleranceAfterStartDate = new Date(startDate.getTime() + startDateToleranceInMilliseconds);

    let game: GameWithTeams;

    try {
      game = await prisma.game.findFirstOrThrow({
        where: {
          awayTeamId: awayTeam.id,
          homeTeamId: homeTeam.id,
          AND: [
            { startDate: { gte: toleranceBeforeStartDate } },
            { startDate: { lte: toleranceAfterStartDate } },
          ],
        },
        include: {
          awayTeam: true,
          homeTeam: true,
        },
      });

      return game;
    } catch { }

    game = await prisma.game.create({
      data: {
        awayTeam: { connect: { id: awayTeam.id } },
        homeTeam: { connect: { id: homeTeam.id } },
        startDate,
      },
      include: {
        awayTeam: true,
        homeTeam: true,
      },
    });

    return game;
  }
}