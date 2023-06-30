import { Exchange, League, Team } from '@prisma/client';

import { prisma } from '@/db';
import { PageParser } from '@/parsers/models/common-models';
import {
  LeagueInitData, TeamsInitDataFactory, mlbInitData, nbaInitData, nflInitData
} from '@/setup';

export class DbLeagueInitializer {
  private readonly pageUrl: string;
  private readonly exchange: Exchange;
  private wrappedLeague: League | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.pageUrl = parentPageParser.pageUrl;
    this.exchange = parentPageParser.exchange;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<DbLeagueInitializer> {
    const dbLeagueInitializer = new DbLeagueInitializer({ parentPageParser });
    await dbLeagueInitializer.init();
    return dbLeagueInitializer;
  }

  private async init(): Promise<DbLeagueInitializer> {
    this.league = await this.findOrCreateLeagueFromPageUrl();
    return this;
  }

  private async findOrCreateLeagueFromPageUrl(): Promise<League> {
    switch (this.exchange.name) {
      case 'DraftKings':
        if (this.pageUrl.includes('mlb')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: mlbInitData });
        }

        if (this.pageUrl.includes('nba')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nbaInitData });
        }

        if (this.pageUrl.includes('nfl')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nflInitData });
        }
      case 'FanDuel':
        if (this.pageUrl.includes('mlb')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: mlbInitData });
        }

        if (this.pageUrl.includes('nba')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nbaInitData });
        }

        if (this.pageUrl.includes('nfl')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nflInitData });
        }
      case 'SugarHouse':
        if (this.pageUrl.includes('1000093616')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: mlbInitData });
        }

        if (this.pageUrl.includes('1000093652')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nbaInitData });
        }

        if (this.pageUrl.includes('1000093656')) {
          return await this.findOrCreateLeagueFromInitData({ leagueInitData: nflInitData });
        }
    }

    throw new Error(`No league found for pageUrl: ${this.pageUrl}`);
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