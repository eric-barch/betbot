import { Page } from 'puppeteer';
import {
  ExchangeInitData, LeagueInitData, PageParserInitData, PageTypeInitData
} from './init-data';

class Config {
  private pageUrls: Array<string>;
  private wrappedPageParsersInitData: Set<PageParserInitData>;

  constructor({
    pageUrls,
  }: {
    pageUrls: Array<string>,
  }) {
    this.pageUrls = pageUrls;
    this.wrappedPageParsersInitData = new Set<PageParserInitData>;
    this.updatePageParsersInitData();
  }

  private updatePageParsersInitData(): Set<PageParserInitData> {
    for (const pageUrl of this.pageUrls) {
      const pageParserInitData = new PageParserInitData({ pageUrl });
      this.pageParsersInitData.add(pageParserInitData);
    }

    return this.wrappedPageParsersInitData;
  }

  public async init(): Promise<Set<PageParserInitData>> {
    for (const pageParserInitData of this.pageParsersInitData) {
      await pageParserInitData.init();
    }

    return this.wrappedPageParsersInitData;
  }

  public findPageParserInitData({
    exchangeInitData,
    leagueInitData,
    pageTypeInitData,
  }: {
    exchangeInitData: ExchangeInitData,
    leagueInitData: LeagueInitData,
    pageTypeInitData: PageTypeInitData,
  }): PageParserInitData {
    for (const pageParserInitData of this.wrappedPageParsersInitData) {
      if (pageParserInitData.matches({
        exchangeInitData,
        leagueInitData,
        pageTypeInitData,
      })) {
        return pageParserInitData;
      }
    }

    throw new Error(`Did not find matching PageParserInitData.`);
  }

  private set pageParsersInitData(pageParsersInitData: Set<PageParserInitData>) {
    this.wrappedPageParsersInitData = pageParsersInitData;
  }

  public get pageParsersInitData(): Set<PageParserInitData> {
    return this.wrappedPageParsersInitData;
  }
}

export const config = new Config({
  pageUrls: [
    'https://sportsbook.draftkings.com/leagues/baseball/mlb',
    'https://sportsbook.draftkings.com/leagues/basketball/nba',
    // 'https://sportsbook.draftkings.com/leagues/football/nfl',
    // 'https://sportsbook.fanduel.com/navigation/mlb',
    // 'https://sportsbook.fanduel.com/navigation/nba',
    // 'https://sportsbook.fanduel.com/navigation/nfl',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093656&type=matches#home',
  ]
});