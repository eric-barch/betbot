import { ElementHandle } from 'puppeteer';

import { PageParser } from '@/parsers/models/shared-models';

import { OddButtonParser } from './odd-button-parser';

export abstract class OddButtonParsers {
  protected readonly parentPageParser: PageParser;
  protected abstract wrappedOddButtonSelector: string | undefined;
  private wrappedButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser>;

  protected constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.wrappedOddButtonParsers = new Set<OddButtonParser>();
  }

  protected async init(): Promise<OddButtonParsers> {
    this.buttons = await this.scrapeButtons();
    this.oddButtonParsers = await this.createOddButtonParsers();
    return this;
  }

  protected async scrapeButtons(): Promise<Array<ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttons = await page.$$(this.oddButtonSelector);
    return this.buttons;
  }

  protected abstract createOddButtonParsers(): Promise<Set<OddButtonParser>>;

  public async updateOddData(): Promise<OddButtonParsers> {
    await Promise.all(Array.from(this.oddButtonParsers).map(oddButtonParser => oddButtonParser.updateOddData()));

    return this;
  };

  protected set oddButtonSelector(oddButtonSelector: string) {
    this.wrappedOddButtonSelector = oddButtonSelector;
  }

  protected get oddButtonSelector(): string {
    if (!this.wrappedOddButtonSelector) {
      throw new Error(`wrappedOddButtonSelector is undefined.`);
    }

    return this.wrappedOddButtonSelector;
  }

  protected set oddButtonParsers(oddButtonParsers: Set<OddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  protected get oddButtonParsers(): Set<OddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }

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