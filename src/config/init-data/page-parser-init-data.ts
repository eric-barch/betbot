import { ExchangeInitData, LeagueInitData, PageTypeInitData, draftKings, fanDuel, sugarHouse, mlb, nba, nfl, gamesPageType } from '.';

export class PageParserInitData {
  private wrappedUrl: string;
  private wrappedExchangeInitData: ExchangeInitData;
  private wrappedLeagueInitData: LeagueInitData;
  private wrappedPageTypeInitData: PageTypeInitData;

  constructor({
    pageUrl,
  }: {
    pageUrl: string,
  }) {
    this.wrappedUrl = pageUrl;
    this.wrappedExchangeInitData = this.updateExchangeInitData();
    this.wrappedLeagueInitData = this.updateLeagueInitData();
    this.wrappedPageTypeInitData = this.updatePageTypeInitData();
  }

  private updateExchangeInitData(): ExchangeInitData {
    if (this.wrappedUrl.includes('draftkings.com')) {
      this.wrappedExchangeInitData = draftKings;
    } else if (this.wrappedUrl.includes('fanduel.com')) {
      this.wrappedExchangeInitData = fanDuel;
    } else if (this.wrappedUrl.includes('playsugarhouse.com')) {
      this.wrappedExchangeInitData = sugarHouse;
    }

    if (!this.wrappedExchangeInitData) {
      throw new Error(`Did not find matching exchange init data.`);
    }

    return this.wrappedExchangeInitData;
  }

  private updateLeagueInitData(): LeagueInitData {
    switch (this.wrappedExchangeInitData) {
      case draftKings:
        if (this.wrappedUrl.includes('mlb')) {
          this.wrappedLeagueInitData = mlb;
        } else if (this.wrappedUrl.includes('nba')) {
          this.wrappedLeagueInitData = nba;
        } else if (this.wrappedUrl.includes('nfl')) {
          this.wrappedLeagueInitData = nfl;
        }
        break;
      case fanDuel:
        if (this.wrappedUrl.includes('mlb')) {
          this.wrappedLeagueInitData = mlb;
        } else if (this.wrappedUrl.includes('nba')) {
          this.wrappedLeagueInitData = nba;
        } else if (this.wrappedUrl.includes('nfl')) {
          this.wrappedLeagueInitData = nfl;
        }
        break;
      case sugarHouse:
        if (this.wrappedUrl.includes('1000093616')) {
          this.wrappedLeagueInitData = mlb;
        } else if (this.wrappedUrl.includes('1000093652')) {
          this.wrappedLeagueInitData = nba;
        } else if (this.wrappedUrl.includes('1000093656')) {
          this.wrappedLeagueInitData = nfl;
        }
        break;
    }

    if (!this.wrappedLeagueInitData) {
      throw new Error(`Did not find matching league init data.`);
    }

    return this.wrappedLeagueInitData;
  }

  private updatePageTypeInitData(): PageTypeInitData {
    switch (this.wrappedExchangeInitData) {
      case draftKings:
        this.wrappedPageTypeInitData = gamesPageType;
        break;
      case fanDuel:
        this.wrappedPageTypeInitData = gamesPageType;
        break;
        break;
      case sugarHouse:
        this.wrappedPageTypeInitData = gamesPageType;
        break;
    }

    if (!this.wrappedPageTypeInitData) {
      throw new Error(`Did not find matching page type init data.`);
    }

    return this.wrappedPageTypeInitData;
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

  public get exchangeInitData(): ExchangeInitData {
    return this.wrappedExchangeInitData;
  }

  public get leagueInitData(): LeagueInitData {
    return this.wrappedLeagueInitData;
  }

  public get pageTypeInitData(): PageTypeInitData {
    return this.wrappedPageTypeInitData;
  }
}