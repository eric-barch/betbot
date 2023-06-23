import { PageParser, ParserFactory } from '@/parsers/models/common-models';
import { DraftKingsParserFactory } from '@/parsers/models/specialized-models';
import { AllPageParserInitData, pageUrls } from '@/setup';

// TODO: Implement as a singleton
export class AllPageParsers {
  private wrappedPageParsers: Set<PageParser> | undefined;

  public static async create(): Promise<AllPageParsers> {
    const allPageParsers = new AllPageParsers();
    await allPageParsers.init();
    return allPageParsers;
  }

  public async init(): Promise<AllPageParsers> {
    const allPageParserInitData = await AllPageParserInitData.create({ pageUrls });

    this.pageParsers = new Set<PageParser>();

    await Promise.all(
      Array.from(allPageParserInitData.pageParserInitData).map(async (pageParserInitData) => {
        const exchange = pageParserInitData.exchange;
        const league = pageParserInitData.league;

        let parserFactory: ParserFactory;

        switch (exchange.name) {
          case 'DraftKings':
            // TODO: Do we want to instantiate a new parser factory for each DraftKings page? Or 
            // should we just use one parser factory for all DraftKings pages?
            parserFactory = new DraftKingsParserFactory();
            break;
          default:
            throw new Error(`Exchange ${exchange.name} is not supported.`);
        }

        const pageParser = await PageParser.create({
          exchange,
          league,
          url: pageParserInitData.url,
          parserFactory,
        });

        this.pageParsers.add(pageParser);
      })
    );

    return this;
  }

  public async updateOdds(): Promise<AllPageParsers> {
    const start = Date.now();

    await Promise.all(
      Array.from(this.pageParsers).map(async (pageParser) => {
        await pageParser.updateOdds();
      })
    );

    const end = Date.now();

    console.log(`Updated in ${end - start}ms`);
    return this;
  }

  public async disconnect(): Promise<AllPageParsers> {
    await Promise.all(
      Array.from(this.pageParsers).map(async (pageParser) => {
        await pageParser.disconnect();
      })
    );

    return this;
  }

  private set pageParsers(pageParsers: Set<PageParser>) {
    this.wrappedPageParsers = pageParsers;
  }

  private get pageParsers(): Set<PageParser> {
    if (!this.wrappedPageParsers) {
      throw new Error('Page parsers have not been initialized.');
    }

    return this.wrappedPageParsers;
  }
}