import { config } from '@/config';
import { PageParser, PageParserFactory } from '@/parsers';

class AllPageParsers {
  private pageParsers: Set<PageParser>;

  constructor() {
    this.pageParsers = new Set<PageParser>;
  }

  public async init(): Promise<Set<PageParser>> {
    await this.initPageParsers();
    return this.pageParsers;
  }

  private async initPageParsers(): Promise<Set<PageParser>> {
    for (const pageParserInitData of config.pageParsersInitData) {
      const pageParser = await PageParserFactory.create({ pageParserInitData });
      this.pageParsers.add(pageParser);
    }

    return this.pageParsers;
  }
}

export const allPageParsers = new AllPageParsers();