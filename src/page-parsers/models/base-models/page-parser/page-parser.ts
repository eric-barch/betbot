import { prisma } from '@/db';
import { Exchange, League, Team } from '@prisma/client';
import {
  ExchangeInitData, LeagueInitData, TeamInitData, mlbTeams, nbaTeams, nflTeams,
} from '@/init-data';
import { WebpageConnector } from './webpage-connector';

export abstract class PageParser {
  private wrappedExchange: Exchange | undefined;
  private exchangeInitData: ExchangeInitData;
  private wrappedLeague: League | undefined;
  private leagueInitData: LeagueInitData;
  private wrappedWebpageConnector: WebpageConnector;

  constructor({
    exchangeInitData,
    leagueInitData,
    url
  }: {
    exchangeInitData: ExchangeInitData,
    leagueInitData: LeagueInitData,
    url: string
  }) {
    this.exchangeInitData = exchangeInitData;
    this.leagueInitData = leagueInitData;
    this.wrappedWebpageConnector = new WebpageConnector({ url });
  }

  protected async init(): Promise<PageParser> {
    await this.connectWebpage();
    await this.connectDbExchangeModel();
    await this.connectDbLeagueModel();
    await this.associateDbExchangeAndLeagueModels();
    await this.initiateDbTeamModels();
    return this;
  }

  private async connectWebpage(): Promise<void> {
    await this.wrappedWebpageConnector.connect();
  }

  private async connectDbExchangeModel(): Promise<Exchange> {
    let exchange: Exchange;

    try {
      exchange = await prisma.exchange.findFirstOrThrow({
        where: {
          name: this.exchangeInitData.name,
        }
      });
    } catch (e) {
      exchange = await prisma.exchange.create({
        data: {
          name: this.exchangeInitData.name,
        }
      });
    }

    this.wrappedExchange = exchange;

    return exchange;
  }

  private async connectDbLeagueModel(): Promise<League> {
    let league: League;

    try {
      league = await prisma.league.findFirstOrThrow({
        where: {
          name: this.leagueInitData.name,
        }
      });
    } catch (e) {
      league = await prisma.league.create({
        data: {
          name: this.leagueInitData.name,
          abbreviation: this.leagueInitData.abbreviation,
        },
      });
    }

    this.wrappedLeague = league;

    return league;
  }

  private async associateDbExchangeAndLeagueModels(): Promise<{
    exchange: Exchange,
    league: League,
  }> {
    const exchange = this.exchange;
    const league = this.league;

    const associatedExchange = await prisma.exchange.update({
      where: { id: exchange.id },
      data: {
        leagues: {
          connect: { id: league.id },
        },
      },
    });

    const associatedLeague = await prisma.league.update({
      where: { id: league.id },
      data: {
        exchanges: {
          connect: { id: exchange.id },
        }
      },
    });

    return {
      exchange: associatedExchange,
      league: associatedLeague,
    }
  }

  private async initiateDbTeamModels(): Promise<Array<Team>> {
    const league = this.league;

    let teamsInitData: Array<TeamInitData>;

    switch (league.abbreviation) {
      case 'MLB':
        teamsInitData = mlbTeams;
        break;
      case 'NBA':
        teamsInitData = nbaTeams;
        break;
      case 'NFL':
        teamsInitData = nflTeams;
        break;
      default:
        throw new Error(`Did not find matching league abbreviation.`);
    }

    let teams = new Array<Team>;

    for (const teamInitData of teamsInitData) {
      let team: Team;

      try {
        team = await prisma.team.findFirstOrThrow({
          where: {
            leagueId: league.id,
            regionFull: teamInitData.regionFull,
            identifierFull: teamInitData.identiferFull,
          }
        });
      } catch (e) {
        team = await prisma.team.create({
          data: {
            league: { connect: { id: league.id } },
            regionFull: teamInitData.regionFull,
            regionAbbr: teamInitData.regionAbbr,
            identifierFull: teamInitData.identiferFull,
            identifierAbbr: teamInitData.idenfierAbbr,
          }
        })
      }

      teams.push(team);
    }

    return teams;
  }

  public get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }

  public get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}