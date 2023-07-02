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

  public static async create({
    parentOddButtonParser,
  }: {
    parentOddButtonParser: OddButtonParser,
  }): Promise<TextContentParser> {
    const textContentParser = new TextContentParser({
      parentOddButtonParser,
    });
    await textContentParser.init();
    return textContentParser;
  }

  private async init(): Promise<TextContentParser> {
    await this.parse();
    return this;
  }

  public async parse(): Promise<void> {
    this.textContent = await this.parentOddButtonParser.button.evaluate(el => el.textContent);

    if (!this.textContent) {
      this.value = null;
      this.price = null;
      return;
    }

    // Normalize minus signs
    const allHyphens = '−-−‐‑‒–—―';
    const normalizedMinusSign = this.textContent.replace(new RegExp(`[${allHyphens}]`, 'g'), '-');

    const numbers = normalizedMinusSign.match(/-?\d+(\.\d+)?/g);

    if (!numbers) {
      this.value = null;
      this.price = null;
      return;
    }

    if (numbers.length === 1) {
      this.value = null;
      this.price = parseInt(numbers[0]);
      return;
    }

    if (numbers.length === 2) {
      this.value = parseFloat(numbers[0]);
      this.price = parseInt(numbers[1]);
      return;
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