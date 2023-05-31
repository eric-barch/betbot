import { PageParser } from '@/page-parsers';
import { PageParserFactory } from '@/page-parsers';
import { config } from '@/config';

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

        for (const pageKey in leagueObject) {
          const url = leagueObject[pageKey as keyof typeof leagueObject];
          const pageParser = await PageParserFactory.create({ url });
          this.add({ pageParser });
        }
      }
    }

    return this.pageParsers;
  }

  public add({
    pageParser,
  }: {
    pageParser: PageParser,
  }) {
    this.wrappedPageParsers.add(pageParser);
  }

  public get pageParsers(): Set<PageParser> {
    return this.wrappedPageParsers;
  }
}

export const allPageParsers = new AllPageParsers();