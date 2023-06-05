import { PageParser } from '@/parsers';
import { OddHandle } from './odd-handle/odd-handle';

export class OddHandleSet {
  private parentPageParser: PageParser;
  private wrappedOddHandles: Set<OddHandle>;

  constructor({
    pageParser,
  }: {
    pageParser: PageParser,
  }) {
    this.parentPageParser = pageParser;
    this.wrappedOddHandles = new Set<OddHandle>;
  }

  public async init(): Promise<OddHandleSet> {
    const buttonElements = await this.parentPageParser.page.$$('div[role="button"].sportsbook-outcome-cell__body');

    for (const buttonElement of buttonElements) {
      const oddHandle = new OddHandle({
        parentPageParser: this.parentPageParser,
        buttonElement,
      });

      await oddHandle.init();

      this.add({ oddHandle });
    }

    return this;
  }

  public add({
    oddHandle,
  }: {
    oddHandle: OddHandle,
  }) {
    this.wrappedOddHandles.add(oddHandle);
  }

  public get pageParser(): PageParser {
    return this.pageParser;
  }
}