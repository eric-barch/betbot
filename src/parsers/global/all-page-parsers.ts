import { PageParser } from '@/parsers/models/common-models';
import { pageUrls } from '@/setup';

// TODO: Implement as a singleton
export class AllPageParsers {
  private readonly pageUrls: Array<string>;
  private wrappedPageParsers: Set<PageParser> | undefined;

  private constructor({
    pageUrls,
  }: {
    pageUrls: Array<string>,
  }) {
    this.pageUrls = pageUrls;
  }

  public static async create(): Promise<AllPageParsers> {
    const allPageParsers = new AllPageParsers({ pageUrls });
    await allPageParsers.init();
    return allPageParsers;
  }

  public async init(): Promise<AllPageParsers> {
    this.pageParsers = new Set<PageParser>();

    for (const pageUrl of this.pageUrls) {
      const pageParser = await PageParser.create({ pageUrl });
      this.pageParsers.add(pageParser);
    }

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