import { PageParser } from '@/page-parsers';
import { OddHandle } from './odd-handle';
import { Exchange } from '@prisma/client';

export class OddHandleSet extends Set<OddHandle> {
  private pageParser: PageParser;

  constructor({
    pageParser,
  }: {
    pageParser: PageParser,
  }) {
    super();
    this.pageParser = pageParser;
  }

  public async init(): Promise<OddHandleSet> {
    const buttonElements = await this.pageParser.page.$$('div[role="button"].sportsbook-outcome-cell__body');

    for (const buttonElement of buttonElements) {
      const oddHandle = new OddHandle({
        buttonElement,
        oddHandleSet: this,
      });

      await oddHandle.init();

      this.add(oddHandle);
    }

    return this;
  }

  get exchange(): Exchange {
    return this.pageParser.exchange;
  }
}