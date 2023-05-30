import { prisma, ExchangeWrapper, LeagueWrapper } from '@/db';
import { Exchange, League } from '@prisma/client';
import { ExchangeInitData, LeagueInitData } from '@/init-data';
import { WebpageConnector } from './webpage-connector';

export abstract class PageParser {
  private exchangeWrapper: ExchangeWrapper;
  private leagueWrapper: LeagueWrapper;
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
    this.exchangeWrapper = new ExchangeWrapper({ exchangeInitData });
    this.leagueWrapper = new LeagueWrapper({ leagueInitData });
    this.wrappedWebpageConnector = new WebpageConnector({ url });
  }

  protected async init(): Promise<PageParser> {
    await this.connectWebpage();
    await this.exchangeWrapper.connectDbModel();
    await this.leagueWrapper.connectDbModel();
    await this.associateDbExchangeAndLeagueModels();
    return this;
  }

  private async connectWebpage(): Promise<void> {
    await this.wrappedWebpageConnector.connect();
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
    return this.exchangeWrapper.exchange;
  }

  public get league(): League {
    return this.leagueWrapper.league;
  }
}