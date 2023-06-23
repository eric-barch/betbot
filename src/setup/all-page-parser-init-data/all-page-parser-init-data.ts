import { PageParserInitData } from './page-parser-init-data';

export class AllPageParserInitData {
  private pageUrls: Array<string>;
  private wrappedPageParserInitData: Set<PageParserInitData> | undefined;

  private constructor({
    pageUrls,
  }: {
    pageUrls: Array<string>,
  }) {
    this.pageUrls = pageUrls;
  }

  public static async create({
    pageUrls,
  }: {
    pageUrls: Array<string>,
  }): Promise<AllPageParserInitData> {
    const allPageParserInitData = new AllPageParserInitData({ pageUrls });
    await allPageParserInitData.init();
    return allPageParserInitData;
  }

  private async init(): Promise<AllPageParserInitData> {
    this.pageParserInitData = new Set<PageParserInitData>();

    for (const pageUrl of this.pageUrls) {
      const pageParserInitData = await PageParserInitData.create({ pageUrl });
      this.pageParserInitData.add(pageParserInitData);
    }

    return this;
  }

  private set pageParserInitData(pageParserInitData: Set<PageParserInitData>) {
    this.wrappedPageParserInitData = pageParserInitData;
  }

  public get pageParserInitData(): Set<PageParserInitData> {
    if (this.wrappedPageParserInitData === undefined) {
      throw new Error(`wrappedPageParserInitData is undefined.`);
    }

    return this.wrappedPageParserInitData;
  }
}