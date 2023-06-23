import { Exchange, League } from '@prisma/client';

import { PageParser } from '@/parsers/models/common-models';
import { LeagueInitData, mlbInitData, nbaInitData, nflInitData } from '@/setup';
import { prisma } from '@/db';

export class DbLeagueInitializer {
  private readonly parentPageParser: PageParser;
  private readonly pageUrl: string;
  private readonly exchange: Exchange;
  private wrappedLeague: League | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
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
    return await prisma.league.upsert({
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