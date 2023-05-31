import { prisma } from '@/db';
import { Exchange, League } from '@prisma/client';
import { ExchangeInitData, LeagueInitData } from '@/init-data';
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