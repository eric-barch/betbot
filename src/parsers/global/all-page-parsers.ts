import { PageParser } from '@/parsers/models/common-models';
import { loopInParallel, pageUrls } from '@/setup';

export class AllPageParsers {
  private static wrappedInstance: AllPageParsers | undefined;
  private readonly pageUrls: Array<string>;
  private wrappedPageParsers: Set<PageParser> | undefined;

  private constructor({
    pageUrls,
  }: {
    pageUrls: Array<string>,
  }) {
    this.pageUrls = pageUrls;
  }

  public static async getInstance(): Promise<AllPageParsers> {
    let instance = AllPageParsers.instance;

    if (instance !== undefined) {
      return instance;
    }

    instance = await AllPageParsers.create();
    return instance;
  }

  private static async create(): Promise<AllPageParsers> {
    AllPageParsers.instance = new AllPageParsers({ pageUrls });
    await AllPageParsers.instance.init();
    return AllPageParsers.instance;
  }

  public async init(): Promise<AllPageParsers> {
    this.pageParsers = new Set<PageParser>();

    /**Do not run in parallel. PageParsers must be created in series to avoid dual entries in db. */
    for (const pageUrl of this.pageUrls) {
      const pageParser = await PageParser.create({ pageUrl });
      this.pageParsers.add(pageParser);
    }

    return this;
  }

  public async update(): Promise<AllPageParsers> {
    const start = Date.now();

    if (loopInParallel) {
      await Promise.all(
        Array.from(this.pageParsers).map(async (pageParser) => {
          await pageParser.update();
        })
      );
    }

    if (!loopInParallel) {
      for (const pageParser of this.pageParsers) {
        await pageParser.update();
      }
    }

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

  private static set instance(instance: AllPageParsers) {
    AllPageParsers.wrappedInstance = instance;
  }

  private static get instance(): AllPageParsers {
    if (!AllPageParsers.wrappedInstance) {
      throw new Error('AllPageParsers has not been initialized.');
    }

    return AllPageParsers.wrappedInstance;
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