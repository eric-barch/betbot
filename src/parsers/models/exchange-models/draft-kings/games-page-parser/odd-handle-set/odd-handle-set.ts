import { PageParser } from '@/parsers';
import { OddHandle } from './odd-handle/odd-handle';

export class OddHandleSet {
  private parentPageParser: PageParser;
  private oddHandles: Set<OddHandle>;

  constructor({
    pageParser,
  }: {
    pageParser: PageParser,
  }) {
    this.parentPageParser = pageParser;
    this.oddHandles = new Set<OddHandle>;
  }

  public async init(): Promise<OddHandleSet> {
    const buttonElements = await this.parentPageParser.page.$$('div[role="button"].sportsbook-outcome-cell__body');

    for (const buttonElement of buttonElements) {
      const oddHandle = new OddHandle({
        parentPageParser: this.parentPageParser,
        buttonElement,
      });

      await oddHandle.init();

      this.oddHandles.add(oddHandle);
    }

    return this;
  }

  public get pageParser(): PageParser {
    return this.pageParser;
  }
}