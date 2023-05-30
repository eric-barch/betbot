import { prisma } from '@/db';
import {
  LeagueInitData, LeagueTeamsInitData, mlb, nba, nfl, mlbTeams, nbaTeams, nflTeams
} from '@/init-data';
import { League } from '@prisma/client';

export class LeagueWrapper {
  private wrappedLeagueInitData: LeagueInitData;
  private wrappedLeague: League | undefined;

  constructor({
    leagueInitData,
  }: {
    leagueInitData: LeagueInitData
  }) {
    this.wrappedLeagueInitData = leagueInitData;
  }

  public async connectDbModel(): Promise<League> {
    let league: League;

    try {
      league = await prisma.league.findFirstOrThrow({
        where: {
          name: this.wrappedLeagueInitData.name,
        }
      });
    } catch (e) {
      league = await prisma.league.create({
        data: {
          name: this.wrappedLeagueInitData.name,
          abbreviation: this.wrappedLeagueInitData.abbreviation,
        }
      })
    }

    this.wrappedLeague = league;

    await this.initTeams();

    return league;
  }

  private async initTeams() {
    let leagueTeams: LeagueTeamsInitData;

    switch (this.wrappedLeagueInitData) {
      case mlb:
        leagueTeams = mlbTeams;
        break;
      case nba:
        leagueTeams = nbaTeams;
        break;
      case nfl:
        leagueTeams = nflTeams;
        break;
      default:
        throw new Error(`Did not find matching leagueTeams.`);
    }

    for (const team of leagueTeams.teams) {
      try {
        await prisma.team.findFirstOrThrow({
          where: {
            regionFull: team.regionFull,
            identifierFull: team.identiferFull,
          }
        });
      } catch (e) {
        await prisma.team.create({
          data: {
            regionFull: team.regionFull,
            regionAbbr: team.regionAbbr,
            identifierFull: team.identiferFull,
            identifierAbbr: team.idenfierAbbr,
            league: { connect: { id: this.league.id } },
          }
        })
      }
    }
  }

  get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}