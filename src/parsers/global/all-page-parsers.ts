import { allPageParserInitData } from '@/setup';
import { IExchangePageParser, PageParser, PageParserFactory as ExchangePageParserFactory } from '@/parsers';

class AllPageParsers {
  private set: Set<IExchangePageParser> = new Set<IExchangePageParser>();

  public async init(): Promise<AllPageParsers> {
    await allPageParserInitData.init();

    await Promise.all(
      Array.from(allPageParserInitData).map(async (pageParserInitData) => {
        const exchangePageParser = await ExchangePageParserFactory.create({ initData: pageParserInitData });
        this.set.add(exchangePageParser);
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