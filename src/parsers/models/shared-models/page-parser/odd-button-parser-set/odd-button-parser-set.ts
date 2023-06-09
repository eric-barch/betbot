import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { OddButtonParser } from './odd-button-parser';

export abstract class OddButtonParserSet {
  protected parentPageParser: PageParser;
  private wrappedButtonElements: Array<p.ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser>;

  protected constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.wrappedOddButtonParsers = new Set<OddButtonParser>;
  }

  protected async init(): Promise<OddButtonParserSet> {
    this.buttonElements = await this.updateButtonElements();
    this.oddButtonParsers = await this.initOddButtonParsers();
    return this;
  }

  protected abstract updateButtonElements(): Promise<Array<p.ElementHandle>>;

  protected abstract initOddButtonParsers(): Promise<Set<OddButtonParser>>;

  protected set buttonElements(buttonElements: Array<p.ElementHandle>) {
    this.wrappedButtonElements = buttonElements;
  }

  protected get buttonElements(): Array<p.ElementHandle> {
    if (!this.wrappedButtonElements) {
      throw new Error(`wrappedButtonElements is undefined.`);
    }

    return this.wrappedButtonElements;
  }

  protected set oddButtonParsers(oddButtonParsers: Set<OddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  public get oddButtonParsers(): Set<OddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }
}