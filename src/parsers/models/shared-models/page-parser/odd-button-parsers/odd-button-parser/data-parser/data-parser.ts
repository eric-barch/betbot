import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/shared-models';

export abstract class DataParser {
  protected readonly parentOddButtonParser: OddButtonParser;
  private wrappedSelector: string | undefined;
  private wrappedElement: ElementHandle | null | undefined;
  private wrappedValue: number | null | undefined;

  protected constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  protected async init(): Promise<DataParser> {
    this.selector = await this.initSelector();
    this.element = await this.getElement();
    this.value = await this.getValue();
    return this;
  }

  protected abstract initSelector(): Promise<string>;

  private async getElement(): Promise<ElementHandle | null> {
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

  protected set selector(selector: string) {
    this.wrappedSelector = selector;
  }

  protected get selector(): string {
    if (!this.wrappedSelector) {
      throw new Error(`wrappedSelector is undefined.`);
    }

    return this.wrappedSelector;
  }

  private set element(element: ElementHandle | null) {
    this.wrappedElement = element;
  }

  private get element(): ElementHandle | null {
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