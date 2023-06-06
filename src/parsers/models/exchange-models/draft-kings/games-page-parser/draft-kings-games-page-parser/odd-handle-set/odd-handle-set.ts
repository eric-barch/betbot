import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { OddHandle } from './odd-handle';

export class OddHandleSet {
  private parentPageParser: PageParser;
  private wrappedButtonElements: Array<p.ElementHandle> | undefined;
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
    await this.updateButtonElements();
    const start = new Date();

    for (const buttonElement of this.buttonElements) {
      const oddHandle = await OddHandle.create({
        parentPageParser: this.parentPageParser,
        parentOddHandleSet: this,
        buttonElement,
      });

      this.oddHandles.add(oddHandle);
    }

    const end = new Date();

    const duration = end.getTime() - start.getTime();
    return this;
  }

  public async update(): Promise<OddHandleSet> {
    await this.updateButtonElements();

    for (const buttonElement of this.buttonElements) {

    }

    return this;
  }

  private async updateButtonElements(): Promise<Array<p.ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttonElements = await page.$$('div[role="button"].sportsbook-outcome-cell__body');
    return this.buttonElements;
  }

  private set buttonElements(buttonElements: Array<p.ElementHandle>) {
    this.wrappedButtonElements = buttonElements;
  }

  public get buttonElements(): Array<p.ElementHandle> {
    if (!this.wrappedButtonElements) {
      throw new Error(`wrappedButtonElements is undefined.`);
    }

    return this.wrappedButtonElements;
  }
}