import { PageParser } from '@/parsers';
import { OddHandle } from './odd-handle';

export class OddHandleSet {
  private parentPageParser: PageParser;
  private oddHandles: Set<OddHandle>;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.oddHandles = new Set<OddHandle>;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<OddHandleSet> {
    const oddHandleSet = new OddHandleSet({ parentPageParser });
    await oddHandleSet.init();
    return oddHandleSet;
  }

  private async init(): Promise<OddHandleSet> {
    const buttonElements = await this.parentPageParser.page.$$('div[role="button"].sportsbook-outcome-cell__body');

    for (const buttonElement of buttonElements) {
      const oddHandle = await OddHandle.create({
        parentPageParser: this.parentPageParser,
        buttonElement,
      });

      this.oddHandles.add(oddHandle);
    }

    return this;
  }
}