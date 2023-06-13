import {
  ExchangeInitData, LeagueInitData, PageParserInitData, PageTypeInitData
} from './page-parser-init-data';

class AllPageParserInitData extends Set<PageParserInitData> {
  private pageUrls: Array<string>;

  constructor({
    pageUrls,
  }: {
    pageUrls: Array<string>,
  }) {
    super();
    this.pageUrls = pageUrls;
  }

  public async init(): Promise<Set<PageParserInitData>> {
    for (const pageUrl of this.pageUrls) {
      const pageParserInitData = await PageParserInitData.create({ pageUrl });
      this.add(pageParserInitData);
    }

    return this;
  }

  public find({
    exchangeInitData,
    leagueInitData,
    pageTypeInitData,
  }: {
    exchangeInitData: ExchangeInitData,
    leagueInitData: LeagueInitData,
    pageTypeInitData: PageTypeInitData,
  }): PageParserInitData {
    for (const pageParserInitData of this) {
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
}

export const allPageParserInitData = new AllPageParserInitData({
  pageUrls: [
    'https://sportsbook.draftkings.com/leagues/baseball/mlb',
    // 'https://sportsbook.draftkings.com/leagues/basketball/nba',
    'https://sportsbook.draftkings.com/leagues/football/nfl',
    // 'https://sportsbook.fanduel.com/navigation/mlb',
    // 'https://sportsbook.fanduel.com/navigation/nba',
    // 'https://sportsbook.fanduel.com/navigation/nfl',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093656&type=matches#home',
  ]
});