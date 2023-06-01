import { config } from '@/config';
import { PageParser, PageParserFactory } from '@/page-parsers';
import { PageParserInitData } from '@/init-data';

class AllPageParsers {
  private wrappedPageParsers: Set<PageParser>;

  constructor() {
    this.wrappedPageParsers = new Set<PageParser>;
  }

  public async initFromConfig(): Promise<Set<PageParser>> {
    for (const exchangeKey in config) {
      const exchangeObject = config[exchangeKey as keyof typeof config];

      for (const leagueKey in exchangeObject) {
        const leagueObject = exchangeObject[leagueKey as keyof typeof exchangeObject];

        for (const pageTypeKey in leagueObject) {
          const url = leagueObject[pageTypeKey as keyof typeof leagueObject];

          const pageParserInitData = new PageParserInitData({
            exchangeKey,
            leagueKey,
            pageTypeKey,
            url,
          });

          const pageParser = await PageParserFactory.create({ pageParserInitData });

          this.wrappedPageParsers.add(pageParser);
        }
      }
    }

    return this.wrappedPageParsers;
  }

  public async update() {
    for (const pageParser of this.wrappedPageParsers) {
      await pageParser.update();
    }
  }
}

export const allPageParsers = new AllPageParsers();