import { OddButtonParser } from '../odd-button-parser';

export class TextContentParser {
  private readonly parentOddButtonParser: OddButtonParser;
  private wrappedTextContent: string | null | undefined;
  private wrappedPrice: number | null | undefined;
  private wrappedValue: number | null | undefined;

  private constructor({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
  }

  public static create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): TextContentParser {
    return new TextContentParser({
      parentOddButtonParser,
    });
  }

  public async parse(): Promise<TextContentParser> {
    this.textContent = await this.parentOddButtonParser.button.evaluate(el => el.textContent);

    if (!this.textContent) {
      this.value = null;
      this.price = null;
      return this;
    }

    // Normalize minus signs
    const allHyphens = '−-−‐‑‒–—―';
    const normalizedMinusSign = this.textContent.replace(new RegExp(`[${allHyphens}]`, 'g'), '-');

    const numbers = normalizedMinusSign.match(/-?\d+(\.\d+)?/g);

    if (!numbers) {
      this.value = null;
      this.price = null;
      return this;
    }

    if (numbers.length === 1) {
      this.value = null;
      this.price = parseInt(numbers[0]);
      return this;
    }

    if (numbers.length === 2) {
      this.value = parseFloat(numbers[0]);
      this.price = parseInt(numbers[1]);
      return this;
    }

    throw new Error(`More than two numbers found in textContent.`);
  }

  private set textContent(textContent: string | null) {
    this.wrappedTextContent = textContent;
  }

  private get textContent(): string | null {
    if (this.wrappedTextContent === undefined) {
      throw new Error('wrappedTextContent is undefined.');
    }
    return this.wrappedTextContent;
  }

  private set price(price: number | null) {
    this.wrappedPrice = price;
  }

  public get price(): number | null {
    if (this.wrappedPrice === undefined) {
      throw new Error('wrappedPrice is undefined.');
    }
    return this.wrappedPrice;
  }

  private set value(value: number | null) {
    this.wrappedValue = value;
  }

  public get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error('wrappedValue is undefined.');
    }
    return this.wrappedValue;
  }
}