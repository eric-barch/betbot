import { prisma } from '@/db';
import { PageParser } from './page-parser';
import { WebpageConnection } from './webpage-connection';
import { PageParserInitData, TeamsInitDataFactory } from '@/init-data';
import { Exchange, League, Team } from '@prisma/client';

export class PageParserInitializer {
  private pageParser: PageParser;
  private pageParserInitData: PageParserInitData;

  constructor({
    pageParser,
    pageParserInitData,
  }: {
    pageParser: PageParser,
    pageParserInitData: PageParserInitData,
  }) {
    this.pageParser = pageParser;
    this.pageParserInitData = pageParserInitData;
  }

  public async initWebpageConnection(): Promise<WebpageConnection> {
    const webpageConnection = new WebpageConnection({ url: this.pageParserInitData.url });
    await webpageConnection.connect();
    return webpageConnection;
  }

  public async initExchange(): Promise<Exchange> {
    let exchange: Exchange;

    try {
      exchange = await prisma.exchange.findFirstOrThrow({
        where: {
          name: this.pageParserInitData.exchangeInitData.name,
        }
      });
    } catch (e) {
      exchange = await prisma.exchange.create({
        data: {
          name: this.pageParserInitData.exchangeInitData.name,
        }
      });
    }

    return exchange;
  }

  public async initLeague(): Promise<League> {
    let league: League;

    try {
      league = await prisma.league.findFirstOrThrow({
        where: {
          name: this.pageParserInitData.leagueInitData.name,
        }
      });
    } catch (e) {
      league = await prisma.league.create({
        data: {
          name: this.pageParserInitData.leagueInitData.name,
          abbreviation: this.pageParserInitData.leagueInitData.abbreviation,
        },
      });
    }

    await this.associateExchangeAndLeagueModels({ league });
    await this.initTeamsInDb({ league });

    return league;
  }

  private async associateExchangeAndLeagueModels({
    league,
  }: {
    league: League,
  }): Promise<{
    exchange: Exchange,
    league: League,
  }> {
    const exchange = this.pageParser.exchange;

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

  private async initTeamsInDb({
    league,
  }: {
    league: League,
  }): Promise<Array<Team>> {
    const teamsInitData = TeamsInitDataFactory.getLeagueTeams({ league });

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
}