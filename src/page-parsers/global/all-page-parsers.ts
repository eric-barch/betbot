import { PageParser } from '@/page-parsers';

class AllPageParsers {
  private wrappedPageParsers: Set<PageParser>;

  constructor() {
    this.wrappedPageParsers = new Set<PageParser>;
  }

  public add(pageParser: PageParser) {
    this.wrappedPageParsers.add(pageParser);
  }

  public get pageParsers(): Set<PageParser> {
    return this.wrappedPageParsers;
  }
}

export const allPageParsers = new AllPageParsers();