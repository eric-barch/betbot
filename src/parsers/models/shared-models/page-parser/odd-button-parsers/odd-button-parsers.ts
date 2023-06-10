import { ElementHandle } from 'puppeteer';

import { PageParser } from '@/parsers';
import { OddButtonParser } from './odd-button-parser';

export abstract class OddButtonParsers extends Set<OddButtonParser> {
  protected parentPageParser: PageParser;
  private wrappedButtons: Array<ElementHandle> | undefined;

  protected constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    super();
    this.parentPageParser = parentPageParser;
  }

  protected async init(): Promise<OddButtonParsers> {
    this.buttons = await this.scrapePageForButtons();
    await this.createOddButtonParsers();
    return this;
  }

  protected abstract scrapePageForButtons(): Promise<Array<ElementHandle>>;

  protected abstract createOddButtonParsers(): Promise<Set<OddButtonParser>>;

  public async updateOddData(): Promise<OddButtonParsers> {
    for (const oddButtonParser of this) {
      await oddButtonParser.updateOddData();
    }

    return this;
  };

  protected set buttons(buttons: Array<ElementHandle>) {
    this.wrappedButtons = buttons;
  }

  protected get buttons(): Array<ElementHandle> {
    if (!this.wrappedButtons) {
      throw new Error(`wrappedButtons is undefined.`);
    }

    return this.wrappedButtons;
  }
}