import { prisma } from './prisma-client';
import { Exchange, ExchangeToGame, Game, League, Team } from '@prisma/client';

export class DbUtilityFunctions {
  public static async findOrCreateDbGameByMatchupAndStartDate({
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

  public static async findDbGameByExchangeAssignedId({
    exchange,
    exchangeAssignedGameId,
  }: {
    exchange: Exchange,
    exchangeAssignedGameId: string,
  }): Promise<Game> {
    const exchangeToGame = await prisma.exchangeToGame.findFirst({
      where: {
        exchangeId: exchange.id,
        exchangeAssignedGameId,
      },
      include: {
        game: true,
      },
    });

    if (!exchangeToGame || !exchangeToGame.game) {
      throw new Error(`No Game found for the provided Exchange and exchangeAssignedGameId: ${exchangeAssignedGameId}`);
    }

    return exchangeToGame.game;
  }

  public static async associateDbExchangeAndDbGameByExchangeAssignedGameId({
    exchange,
    game,
    exchangeAssignedGameId,
  }: {
    exchange: Exchange,
    game: Game,
    exchangeAssignedGameId: string,
  }): Promise<ExchangeToGame> {
    return await prisma.exchangeToGame.upsert({
      where: {
        exchangeId_gameId: {
          exchangeId: exchange.id,
          gameId: game.id,
        }
      },
      update: {
        exchangeAssignedGameId,
      },
      create: {
        exchange: { connect: { id: exchange.id } },
        game: { connect: { id: game.id } },
        exchangeAssignedGameId,
      },
    });
  }

  public static async findDbTeamByLeagueAndUnformattedName({
    league,
    unformattedName,
  }: {
    league: League,
    unformattedName: string,
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