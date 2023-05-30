import { prisma } from '@/db';
import { ExchangeInitData, LeagueInitData } from '@/init-data';
import { Exchange, League } from '@prisma/client';
import { WebpageConnector } from './webpage-connector';

export abstract class PageParser {
  private wrappedExchangeInitData: ExchangeInitData;
  private wrappedExchange: Exchange | undefined;
  private wrappedLeagueInitData: LeagueInitData;
  private wrappedLeague: League | undefined;
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
    this.wrappedExchangeInitData = exchangeInitData;
    this.wrappedLeagueInitData = leagueInitData;
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
          name: this.wrappedExchangeInitData.name,
        },
      });
    } catch (e) {
      exchange = await prisma.exchange.create({
        data: {
          name: this.wrappedExchangeInitData.name,
        }
      })
    }

    this.wrappedExchange = exchange;

    return exchange;
  }

  private async connectDbLeagueModel(): Promise<League> {
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

    return league;
  }

  private async associateDbExchangeAndLeagueModels() {
    const exchange = this.exchange;
    const league = this.league;

    await prisma.exchange.update({
      where: { id: exchange.id },
      data: {
        leagues: {
          connect: { id: league.id },
        },
      },
    });

    await prisma.league.update({
      where: { id: league.id },
      data: {
        exchanges: {
          connect: { id: exchange.id },
        },
      },
    });
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