import { config } from '@/config';
import { PageParser, PageParserFactory } from '@/parsers';

class AllPageParsers {
  private pageParsers: Set<PageParser>;

  constructor() {
    this.pageParsers = new Set<PageParser>;
  }

  public async init(): Promise<AllPageParsers> {
    for (const pageParserInitData of config.pageParsersInitData) {
      const pageParser = await PageParserFactory.create({ pageParserInitData });
      this.pageParsers.add(pageParser);
    }

    return this;
  }

  public async update(): Promise<AllPageParsers> {
    for (const pageParser of this.pageParsers) {
      await pageParser.update();
    }

    return this;
  }

  public async disconnect(): Promise<AllPageParsers> {
    for (const pageParser of this.pageParsers) {
      await pageParser.disconnect();
    }

    return this;
  }
}

export const allPageParsers = new AllPageParsers();