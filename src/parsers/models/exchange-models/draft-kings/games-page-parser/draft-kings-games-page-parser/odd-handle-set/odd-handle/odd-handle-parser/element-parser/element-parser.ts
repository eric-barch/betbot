import * as p from 'puppeteer';

import { OddHandleParser } from '../odd-handle-parser';
import { Odd } from '@prisma/client';

export class OddDataElementParser {
  private element: p.ElementHandle | null;
  private wrappedValue: number | null | undefined;

  private constructor({
    element,
  }: {
    element: p.ElementHandle | null,
  }) {
    this.element = element;
  }

  public static async create({
    element,
  }: {
    element: p.ElementHandle | null,
  }): Promise<OddDataElementParser> {
    const elementParser = new OddDataElementParser({ element });
    await elementParser.parse();
    return elementParser;
  }

  public async parse(): Promise<number | null> {
    if (!this.element) {
      this.value = null;
      return this.value;
    }

    const elementString = await (await this.element.getProperty('textContent')).jsonValue();

    if (!elementString) {
      this.value = null;
      return this.value;
    }

    const allHyphens = '−-−‐‑‒–—―';
    const elementStringWithStandardMinusSign = elementString.replace(new RegExp(`[${allHyphens}]`, 'g'), '-');
    const cleanString = elementStringWithStandardMinusSign.replace(/[^0-9.-]/g, '');

    this.value = Number(cleanString);
    return this.value;
  }

  private set value(value: number | null) {
    this.wrappedValue = value;
  }

  public get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error(`wrappedValue is undefined.`);
    }

    return this.wrappedValue;
  }
}