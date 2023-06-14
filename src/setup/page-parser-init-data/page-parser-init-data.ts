
import { Exchange, League, Team } from '@prisma/client';

import { prisma } from '@/db';

import {
  ExchangeInitData, LeagueInitData, PageTypeInitData, TeamsInitDataFactory, draftKingsInitData,
  fanDuelInitData, gamesPageTypeInitData, mlbInitData, nbaInitData, nflInitData, sugarHouseInitData,
} from './init-data';


export class PageParserInitData {
  private wrappedUrl: string;
  private wrappedExchangeInitData: ExchangeInitData;
  private wrappedLeagueInitData: LeagueInitData;
  private wrappedPageTypeInitData: PageTypeInitData;
  private wrappedExchange: Exchange | undefined;
  private wrappedLeague: League | undefined;

  private constructor({
    pageUrl,
  }: {
    pageUrl: string,
  }) {
    this.wrappedUrl = pageUrl;
    this.wrappedExchangeInitData = this.parseExchangeInitData();
    this.wrappedLeagueInitData = this.parseLeagueInitData();
    this.wrappedPageTypeInitData = this.parsePageTypeInitData();
  }

  public static async create({
    pageUrl,
  }: {
    pageUrl: string,
  }) {
    const pageParserInitData = new PageParserInitData({ pageUrl });
    await pageParserInitData.ensureObjectsInDb();
    return pageParserInitData;
  }

  private parseExchangeInitData(): ExchangeInitData {
    if (this.url.includes('draftkings.com')) {
      this.exchangeInitData = draftKingsInitData;
    } else if (this.url.includes('fanduel.com')) {
      this.exchangeInitData = fanDuelInitData;
    } else if (this.url.includes('playsugarhouse.com')) {
      this.exchangeInitData = sugarHouseInitData;
    } else {
      throw new Error(`Did not find matching exchangeInitData.`);
    }

    return this.exchangeInitData;
  }

  private parseLeagueInitData(): LeagueInitData {
    switch (this.exchangeInitData) {
      case draftKingsInitData:
        if (this.url.includes('mlb')) {
          this.leagueInitData = mlbInitData;
        } else if (this.url.includes('nba')) {
          this.leagueInitData = nbaInitData;
        } else if (this.url.includes('nfl')) {
          this.leagueInitData = nflInitData;
        }
        break;
      case fanDuelInitData:
        if (this.url.includes('mlb')) {
          this.leagueInitData = mlbInitData;
        } else if (this.url.includes('nba')) {
          this.leagueInitData = nbaInitData;
        } else if (this.url.includes('nfl')) {
          this.leagueInitData = nflInitData;
        }
        break;
      case sugarHouseInitData:
        if (this.url.includes('1000093616')) {
          this.leagueInitData = mlbInitData;
        } else if (this.url.includes('1000093652')) {
          this.leagueInitData = nbaInitData;
        } else if (this.url.includes('1000093656')) {
          this.leagueInitData = nflInitData;
        }
        break;
    }

    if (!this.leagueInitData) {
      throw new Error(`Did not find matching leagueInitData.`);
    }

    return this.leagueInitData;
  }

  private parsePageTypeInitData(): PageTypeInitData {
    switch (this.exchangeInitData) {
      case draftKingsInitData:
        this.pageTypeInitData = gamesPageTypeInitData;
        break;
      case fanDuelInitData:
        this.pageTypeInitData = gamesPageTypeInitData;
        break;
        break;
      case sugarHouseInitData:
        this.pageTypeInitData = gamesPageTypeInitData;
        break;
    }

    if (!this.pageTypeInitData) {
      throw new Error(`Did not find matching pageTypeInitData.`);
    }

    return this.wrappedPageTypeInitData;
  }

  private async ensureObjectsInDb(): Promise<PageParserInitData> {
    await this.ensureExchangeInDb();
    await this.ensureLeagueInDb();
    await this.ensureTeamsInDb();
    return this;
  }

  private async ensureExchangeInDb(): Promise<Exchange> {
    this.exchange = await prisma.exchange.upsert({
      where: {
        name: this.wrappedExchangeInitData.name,
      },
      update: {},
      create: {
        name: this.wrappedExchangeInitData.name,
      },
    });

    return this.exchange;
  }

  private async ensureLeagueInDb(): Promise<League> {
    this.league = await prisma.league.upsert({
      where: {
        name: this.wrappedLeagueInitData.name,
      },
      update: {
        abbreviation: this.wrappedLeagueInitData.abbreviation,
      },
      create: {
        name: this.wrappedLeagueInitData.name,
        abbreviation: this.wrappedLeagueInitData.abbreviation,
      },
    });

    return this.league;
  }

  private async ensureTeamsInDb(): Promise<Array<Team>> {
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


  public matches({
    exchangeInitData,
    leagueInitData,
    pageTypeInitData,
  }: {
    exchangeInitData: ExchangeInitData,
    leagueInitData: LeagueInitData,
    pageTypeInitData: PageTypeInitData,
  }): boolean {
    const exchangeMatches = (this.wrappedExchangeInitData === exchangeInitData);
    const leagueMatches = (this.wrappedLeagueInitData === leagueInitData);
    const pageTypeMatches = (this.wrappedPageTypeInitData === pageTypeInitData);

    if (exchangeMatches && leagueMatches && pageTypeMatches) {
      return true;
    }

    return false;
  }

  public get url(): string {
    return this.wrappedUrl;
  }

  private set exchangeInitData(exchangeInitData: ExchangeInitData) {
    this.wrappedExchangeInitData = exchangeInitData;
  }

  public get exchangeInitData(): ExchangeInitData {
    return this.wrappedExchangeInitData;
  }

  private set leagueInitData(leagueInitData: LeagueInitData) {
    this.wrappedLeagueInitData = leagueInitData;
  }

  public get leagueInitData(): LeagueInitData {
    return this.wrappedLeagueInitData;
  }

  private set pageTypeInitData(pageTypeInitData: PageTypeInitData) {
    this.wrappedPageTypeInitData = pageTypeInitData;
  }

  public get pageTypeInitData(): PageTypeInitData {
    return this.wrappedPageTypeInitData;
  }

  private set exchange(exchange: Exchange) {
    this.wrappedExchange = exchange;
  }

  private get exchange(): Exchange {
    if (!this.wrappedExchange) {
      throw new Error(`wrappedExchange is undefined.`);
    }

    return this.wrappedExchange;
  }

  private set league(league: League) {
    this.wrappedLeague = league;
  }

  private get league(): League {
    if (!this.wrappedLeague) {
      throw new Error(`wrappedLeague is undefined.`);
    }

    return this.wrappedLeague;
  }
}