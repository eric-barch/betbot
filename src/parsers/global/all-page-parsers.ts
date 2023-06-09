import { allPageParserInitData } from '@/setup';
import { PageParser, PageParserFactory } from '@/parsers';

class AllPageParsers extends Set<PageParser> {
  public async init(): Promise<AllPageParsers> {
    await allPageParserInitData.init();

    for (const pageParserInitData of allPageParserInitData) {
      const pageParser = await PageParserFactory.create({ pageParserInitData });
      this.add(pageParser);
    }

    return this;
  }

  public async update(): Promise<AllPageParsers> {
    for (const pageParser of this) {
      console.log('Implement AllPageParsers.update()');
    }

    return this;
  }

  public async disconnect(): Promise<AllPageParsers> {
    for (const pageParser of this) {
      await pageParser.disconnect();
    }

    return this;
  }
}

export const allPageParsers = new AllPageParsers();