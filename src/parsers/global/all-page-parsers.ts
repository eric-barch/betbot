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

  public async updateOddData(): Promise<AllPageParsers> {
    const start = Date.now();
    for (const pageParser of this) {
      await pageParser.updateOddData();
    }
    const end = Date.now();

    console.log(`Updated in ${end - start}ms`);
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