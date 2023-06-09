import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { OddButtonParser } from './odd-button-parser';

export abstract class OddButtonParserSet extends Set<OddButtonParser> {
  protected parentPageParser: PageParser;
  private wrappedButtons: Array<p.ElementHandle> | undefined;

  protected constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    super();
    this.parentPageParser = parentPageParser;
  }

  protected async init(): Promise<OddButtonParserSet> {
    this.buttons = await this.scrapePageForButtons();
    await this.initOddButtonParsers();
    return this;
  }

  protected abstract scrapePageForButtons(): Promise<Array<p.ElementHandle>>;

  protected abstract initOddButtonParsers(): Promise<Set<OddButtonParser>>;

  public async updateOddData(): Promise<OddButtonParserSet> {
    for (const oddButtonParser of this) {
      await oddButtonParser.updateOddData();
    }

    return this;
  };

  protected set buttons(buttonElements: Array<p.ElementHandle>) {
    this.wrappedButtons = buttonElements;
  }

  protected get buttons(): Array<p.ElementHandle> {
    if (!this.wrappedButtons) {
      throw new Error(`wrappedButtons is undefined.`);
    }

    return this.wrappedButtons;
  }
}