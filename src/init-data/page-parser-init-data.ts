import {
  ExchangeInitData, LeagueInitData, PageTypeInitData, draftKings, fanDuel, sugarHouse, mlb, nba,
  nfl, gamesPageType,
} from '@/init-data';

export class PageParserInitData {
  private wrappedExchangeInitData: ExchangeInitData;
  private wrappedLeagueInitData: LeagueInitData;
  private wrappedPageTypeInitData: PageTypeInitData;
  private wrappedUrl: string;

  constructor({
    exchangeKey,
    leagueKey,
    pageTypeKey,
    url,
  }: {
    exchangeKey: string,
    leagueKey: string,
    pageTypeKey: string,
    url: string,
  }) {
    this.wrappedExchangeInitData = this.parseExchange({ exchangeKey });
    this.wrappedLeagueInitData = this.parseLeague({ leagueKey });
    this.wrappedPageTypeInitData = this.parsePageType({ pageTypeKey });
    this.wrappedUrl = url;
  }

  private parseExchange({
    exchangeKey
  }: {
    exchangeKey: string,
  }): ExchangeInitData {
    switch (exchangeKey) {
      case 'draftKings':
        return draftKings;
      case 'fanDuel':
        return fanDuel;
      case 'sugarHouse':
        return sugarHouse;
      default:
        throw new Error(`Did not find matching ExchangeInitData.`);
    }
  }

  private parseLeague({
    leagueKey,
  }: {
    leagueKey: string,
  }): LeagueInitData {
    switch (leagueKey) {
      case 'mlb':
        return mlb;
      case 'nba':
        return nba;
      case 'nfl':
        return nfl;
      default:
        throw new Error(`Did not find matching LeagueInitData.`);
    }
  }

  private parsePageType({
    pageTypeKey,
  }: {
    pageTypeKey: string,
  }): PageTypeInitData {
    switch (pageTypeKey) {
      case 'games':
        return gamesPageType;
      default:
        throw new Error(`Did not find matching PageTypeInitData.`);
    }
  }

  public matches({
    exchange,
    league,
    pageType,
  }: {
    exchange: ExchangeInitData,
    league: LeagueInitData,
    pageType: PageTypeInitData,
  }): boolean {
    const exchangeMatches = (this.wrappedExchangeInitData === exchange);
    const leagueMatches = (this.wrappedLeagueInitData === league);
    const pageTypeMatches = (this.wrappedPageTypeInitData === pageType);

    if (exchangeMatches && leagueMatches && pageTypeMatches) {
      return true;
    }

    return false;
  }

  public get exchangeInitData(): ExchangeInitData {
    return this.wrappedExchangeInitData;
  }

  public get leagueInitData(): LeagueInitData {
    return this.wrappedLeagueInitData;
  }

  public get pageTypeInitData(): PageTypeInitData {
    return this.wrappedPageTypeInitData;
  }

  public get url(): string {
    return this.wrappedUrl;
  }
}