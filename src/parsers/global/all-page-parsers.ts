import { allPageParserInitData } from '@/setup';
import { PageParser, PageParserFactory } from '@/parsers';

class AllPageParsers {
  private set: Set<PageParser> = new Set<PageParser>();

  public async init(): Promise<AllPageParsers> {
    await allPageParserInitData.init();

    await Promise.all(
      Array.from(allPageParserInitData).map(async (pageParserInitData) => {
        const pageParser = await PageParserFactory.create({ initData: pageParserInitData });
        this.set.add(pageParser);
      })
    );

    return this;
  }

  public async updateOdds(): Promise<AllPageParsers> {
    const start = Date.now();

    await Promise.all(
      Array.from(this.set).map(async (pageParser) => {
        await pageParser.updateOdds();
      })
    );


    const end = Date.now();

    console.log(`Updated in ${end - start}ms`);
    return this;
  }

  public async disconnect(): Promise<AllPageParsers> {
    await Promise.all(
      Array.from(this.set).map(async (pageParser) => {
        await pageParser.disconnect();
      })
    );

    return this;
  }
}

export const allPageParsers = new AllPageParsers();