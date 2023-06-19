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
    await Promise.all(
      Array.from(this.pageUrls).map(async (pageUrl) => {
        const pageParserInitData = await PageParserInitData.create({ pageUrl });
        this.add(pageParserInitData);
      })
    );

    return this;
  }


  public async find({
    exchangeInitData,
    leagueInitData,
    pageTypeInitData,
  }: {
    exchangeInitData: ExchangeInitData,
    leagueInitData: LeagueInitData,
    pageTypeInitData: PageTypeInitData,
  }): Promise<PageParserInitData> {
    const pageParserInitData = await Promise.any(
      Array.from(this).map((pageParserInitData) =>
        new Promise<PageParserInitData>((resolve, reject) => {
          if (pageParserInitData.matches({
            exchangeInitData,
            leagueInitData,
            pageTypeInitData,
          })) {
            resolve(pageParserInitData);
          } else {
            reject(new Error('Does not match'));
          }
        })
      )
    );

    return pageParserInitData;
  }


}

export const allPageParserInitData = new AllPageParserInitData({
  pageUrls: [
    'https://sportsbook.draftkings.com/leagues/baseball/mlb',
    // 'https://sportsbook.draftkings.com/leagues/basketball/nba',
    // 'https://sportsbook.draftkings.com/leagues/football/nfl',
    'https://sportsbook.fanduel.com/navigation/mlb',
    // 'https://sportsbook.fanduel.com/navigation/nba',
    // 'https://sportsbook.fanduel.com/navigation/nfl',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093616&type=matches#home',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home',
    // 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093656&type=matches#home',
  ]
});