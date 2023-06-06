import * as p from 'puppeteer';
import { OddHandleParser } from '../odd-handle-parser';

export abstract class DataParser {
  private parentOddHandleParser: OddHandleParser;
  protected abstract selector: string;
  private element: p.ElementHandle | null | undefined;
  private wrappedValue: number | null | undefined;

  protected constructor({
    parentOddHandleParser,
  }: {
    parentOddHandleParser: OddHandleParser,
  }) {
    this.parentOddHandleParser = parentOddHandleParser;
  }


  public async update(): Promise<DataParser> {
    await this.updateElement();
    await this.updateValue();
    return this;
  }

  private async updateElement(): Promise<p.ElementHandle | null> {
    const buttonElement = this.parentOddHandleParser.buttonElement;

    if (!buttonElement) {
      this.element = null;
      return this.element;
    }

    this.element = await buttonElement.$(`${this.selector}`);
    return this.element;
  }

  public async updateValue(): Promise<number | null> {
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