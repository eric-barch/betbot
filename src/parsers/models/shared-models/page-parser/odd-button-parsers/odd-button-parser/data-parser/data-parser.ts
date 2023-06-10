import * as p from 'puppeteer';

import { OddButtonParser } from '../odd-button-parser';

export class DataParser {
  private readonly parentOddButtonParser: OddButtonParser;
  private selector: string;
  private wrappedElement: p.ElementHandle | null | undefined;
  private wrappedValue: number | null | undefined;

  protected constructor({
    parentOddButtonParser,
    selector,
  }: {
    parentOddButtonParser: OddButtonParser,
    selector: string,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.selector = selector;
  }

  public static async create({
    parentOddButtonParser,
    selector,
  }: {
    parentOddButtonParser: OddButtonParser,
    selector: string,
  }): Promise<DataParser> {
    const dataParser = new DataParser({
      parentOddButtonParser,
      selector,
    });
    await dataParser.updateElement();
    await dataParser.getValue();
    return dataParser;
  }

  private async updateElement(): Promise<p.ElementHandle | null> {
    const button = this.parentOddButtonParser.button;
    this.element = await button.$(`${this.selector}`);
    return this.element;
  }

  public async getValue(): Promise<number | null> {
    if (!this.element) {
      this.value = null;
      return this.value;
    }

    const textContent = await (await this.element.getProperty('textContent')).jsonValue();

    if (!textContent) {
      this.value = null;
      return this.value;
    }

    const allHyphens = '−-−‐‑‒–—―';
    const textContentStandardMinusSign = textContent.replace(new RegExp(`[${allHyphens}]`, 'g'), '-');
    const cleanTextContent = textContentStandardMinusSign.replace(/[^0-9.-]/g, '');

    this.value = Number(cleanTextContent);
    return this.value;
  }

  private set element(element: p.ElementHandle | null) {
    this.wrappedElement = element;
  }

  private get element(): p.ElementHandle | null {
    if (this.wrappedElement === undefined) {
      throw new Error(`wrappedElementHandle is undefined.`);
    }

    return this.wrappedElement;
  }

  private set value(value: number | null) {
    this.wrappedValue = value;
  }

  private get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error(`wrappedValue is undefined.`);
    }

    return this.wrappedValue;
  }

}