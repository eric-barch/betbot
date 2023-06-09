import { prisma } from './prisma-client';
import { Exchange, ExchangeToGame, Game, League, Odd, Statistic, Team } from '@prisma/client';

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
          active: true,
        }
      })
    }

    return game;
  }

  public static async findGameByExchangeAndExchangeAssignedGameId({
    exchange,
    exchangeAssignedGameId,
  }: {
    exchange: Exchange,
    exchangeAssignedGameId: string,
  }): Promise<Game> {
    const exchangeToGame = await prisma.exchangeToGame.findUniqueOrThrow({
      where: {
        exchangeId_exchangeAssignedGameId: {
          exchangeId: exchange.id,
          exchangeAssignedGameId,
        }
      }
    });

    const game = await prisma.game.findUniqueOrThrow({
      where: {
        id: exchangeToGame.gameId,
      }
    });

    return game;
  }

  public static async associateExchangeAndGameByExchangeAssignedGameId({
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

  public static async findTeamByLeagueAndUnformattedName({
    league,
    unformattedName,
  }: {
    league: League,
    unformattedName: string,
  }): Promise<Team> {
    unformattedName = unformattedName.replace(/[^a-zA-Z]/g, ' ');

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

  public static async findOrCreateStatisticByGameAndStatisticName({
    game,
    statisticName,
  }: {
    game: Game,
    statisticName: string,
  }): Promise<Statistic> {
    const statistic = await prisma.statistic.upsert({
      where: {
        name_gameId: {
          name: statisticName,
          gameId: game.id,
        }
      },
      update: {},
      create: {
        name: statisticName,
        gameId: game.id,
        active: true,
      },
    });

    return statistic;
  }

  public static async findOrCreateOddByExchangeAndStatistic({
    exchange,
    statistic,
  }: {
    exchange: Exchange,
    statistic: Statistic,
  }): Promise<Odd> {
    const exchangeId = exchange.id;
    const statisticId = statistic.id;

    const odd = await prisma.odd.upsert({
      where: {
        exchangeId_statisticId: {
          exchangeId,
          statisticId,
        }
      },
      update: {},
      create: {
        exchangeId,
        statisticId,
      }
    });

    return odd;
  }

  public static async findExchangeByName({
    name,
  }: {
    name: string,
  }): Promise<Exchange> {
    const exchange = await prisma.exchange.findUniqueOrThrow({
      where: {
        name,
      }
    });

    return exchange;
  }

  public static async findLeagueByName({
    name,
  }: {
    name: string,
  }): Promise<League> {
    const league = await prisma.league.findUniqueOrThrow({
      where: {
        name,
      }
    });

    return league;
  }
}