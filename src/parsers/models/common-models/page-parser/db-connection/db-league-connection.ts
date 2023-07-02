import { League, Team } from '@prisma/client';

import { prisma } from '@/db';
import { PageParser } from '@/parsers/models/common-models';
import {
  LeagueInitData, TeamsInitDataFactory, mlbInitData, nbaInitData, nflInitData
} from '@/setup';

export class DbLeagueConnection {
  private readonly parentPageParser: PageParser;
  private wrappedLeague: League | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<DbLeagueConnection> {
    const dbLeagueConnection = new DbLeagueConnection({ parentPageParser });
    await dbLeagueConnection.init();
    return dbLeagueConnection;
  }

  private async init(): Promise<DbLeagueConnection> {
    this.league = await this.findOrCreateLeagueFromPageUrl();
    return this;
  }

  private async findOrCreateLeagueFromPageUrl(): Promise<League> {
    const exchange = this.parentPageParser.exchange;
    const pageUrl = this.parentPageParser.pageUrl;

    switch (exchange.name) {
      case 'DraftKings':
        if (pageUrl.includes('mlb')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: mlbInitData });
        }

        if (pageUrl.includes('nba')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nbaInitData });
        }

        if (pageUrl.includes('nfl')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nflInitData });
        }
      case 'FanDuel':
        if (pageUrl.includes('mlb')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: mlbInitData });
        }

        if (pageUrl.includes('nba')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nbaInitData });
        }

        if (pageUrl.includes('nfl')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nflInitData });
        }
      case 'SugarHouse':
        if (pageUrl.includes('1000093616')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: mlbInitData });
        }

        if (pageUrl.includes('1000093652')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nbaInitData });
        }

        if (pageUrl.includes('1000093656')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nflInitData });
        }
    }

    throw new Error(`No league found for pageUrl: ${pageUrl}`);
  }

  private async findOrCreateLeagueFromInitData({
    leagueInitData,
  }: {
    leagueInitData: LeagueInitData,
  }): Promise<League> {
    this.league = await prisma.league.upsert({
      where: {
        name: leagueInitData.name,
      },
      update: {
        abbreviation: leagueInitData.abbreviation,
      },
      create: {
        name: leagueInitData.name,
        abbreviation: leagueInitData.abbreviation,
      }
    });

    await this.findOrCreateLeagueTeams();

    return this.league;
  }

  private async findOrCreateLeagueTeams(): Promise<Array<Team>> {
    const teamsInitData = TeamsInitDataFactory.getLeagueTeams({ league: this.league });

    const teams = await Promise.all(
      teamsInitData.map((teamInitData) =>
        prisma.team.upsert({
          where: {
            leagueId_identifierFull: {
              leagueId: this.league.id,
              identifierFull: teamInitData.identifierFull,
            },
          },
          update: {
            regionAbbr: teamInitData.regionAbbr,
            regionFull: teamInitData.regionFull,
            identifierAbbr: teamInitData.identifierAbbr,
          },
          create: {
            leagueId: this.league.id,
            regionAbbr: teamInitData.regionAbbr,
            regionFull: teamInitData.regionFull,
            identifierAbbr: teamInitData.identifierAbbr,
            identifierFull: teamInitData.identifierFull,
          },
        })
      )
    );

    return teams;
  }

  public get league(): League {
    if (!this.wrappedLeague) {
      throw new Error('League not initialized');
    }

    return this.wrappedLeague;
  }

  private set league(league: League) {
    this.wrappedLeague = league;
  }
}