import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { PageParser } from '../../page-parser'; import { ParserFactory } from '../../../parser-factory';

import { OddButton } from './odd-button';
import { DbGameInitializer, DbOddInitializer, DbStatisticInitializer } from './db-initializers';

export interface SpecializedOddButtonParser {
  updateOdd(): Promise<CommonOddButtonParser>;
}

export class CommonOddButtonParser {
  private readonly parentPageParser: PageParser;
  private readonly parserFactory: ParserFactory;
  private readonly specializedOddButtonParser: SpecializedOddButtonParser;
  private wrappedOddButton: OddButton | undefined;
  private wrappedDbGameInitializer: DbGameInitializer | undefined;
  private wrappedDbStatisticInitializer: DbStatisticInitializer | undefined;
  private wrappedDbOddInitializer: DbOddInitializer | undefined;
  private wrappedTextContent: string | null | undefined;
  private wrappedPrice: number | null | undefined;
  private wrappedValue: number | null | undefined;

  private constructor({
    parentPageParser,
    parserFactory,
    specializedOddButtonParser,
  }: {
    parentPageParser: PageParser,
    parserFactory: ParserFactory,
    specializedOddButtonParser: SpecializedOddButtonParser,
  }) {
    this.parentPageParser = parentPageParser;
    this.parserFactory = parserFactory;
    this.specializedOddButtonParser = specializedOddButtonParser;
  }

  public static async create({
    parentPageParser,
    parserFactory,
    specializedOddButtonParser,
  }: {
    parentPageParser: PageParser,
    parserFactory: ParserFactory,
    specializedOddButtonParser: SpecializedOddButtonParser,
  }): Promise<CommonOddButtonParser> {
    const commonOddButtonParser = new CommonOddButtonParser({
      parentPageParser,
      parserFactory,
      specializedOddButtonParser,
    });
    await commonOddButtonParser.init();
    return commonOddButtonParser;
  }

  private async init(): Promise<CommonOddButtonParser> {
    this.oddButton = await this.parserFactory.createOddButton();
    this.dbGameInitializer = await this.parserFactory.createDbGameInitializer();
    this.dbStatisticInitializer = await this.parserFactory.createDbStatisticInitializer();
    this.dbOddInitializer = await DbOddInitializer.create();

    return this;
  }

  protected async updateDbOddFromTextContent(): Promise<void> {
    await this.getTextContent();
    await this.parseTextContent();

    await this.dbOddInitializer.updateData({
      price: this.price,
      value: this.value,
    });
  }

  private async getTextContent(): Promise<string | null> {
    this.textContent = await (await this.button.getProperty('textContent')).jsonValue();
    return this.textContent;
  }

  private async parseTextContent(): Promise<void> {
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

  protected set oddButton(oddButton: OddButton) {
    this.wrappedOddButton = oddButton;
  }

  protected get oddButton(): OddButton {
    if (!this.wrappedOddButton) {
      throw new Error(`wrappedOddButton is undefined.`);
    }

    return this.wrappedOddButton;
  }

  public get button(): ElementHandle {
    return this.oddButton.button;
  }

  protected set dbGameInitializer(dbGameInitializer: DbGameInitializer) {
    this.wrappedDbGameInitializer = dbGameInitializer;
  }

  protected get dbGameInitializer(): DbGameInitializer {
    if (!this.wrappedDbGameInitializer) {
      throw new Error(`wrappedDbGameInitializer is undefined.`);
    }

    return this.wrappedDbGameInitializer;
  }

  public get game(): Game {
    return this.dbGameInitializer.game;
  }

  protected set dbStatisticInitializer(dbStatisticInitializer: DbStatisticInitializer) {
    this.wrappedDbStatisticInitializer = dbStatisticInitializer;
  }

  protected get dbStatisticInitializer(): DbStatisticInitializer {
    if (!this.wrappedDbStatisticInitializer) {
      throw new Error(`wrappedDbStatisticInitializer is undefined.`);
    }

    return this.wrappedDbStatisticInitializer;
  }

  public get statistic(): Statistic {
    return this.dbStatisticInitializer.statistic;
  }

  protected set dbOddInitializer(dbOddInitializer: DbOddInitializer) {
    this.wrappedDbOddInitializer = dbOddInitializer;
  }

  protected get dbOddInitializer(): DbOddInitializer {
    if (!this.wrappedDbOddInitializer) {
      throw new Error(`wrappedDbOddInitializer is undefined.`);
    }

    return this.wrappedDbOddInitializer;
  }

  public get odd(): Odd {
    return this.dbOddInitializer.odd;
  }

  protected set textContent(textContent: string | null) {
    this.wrappedTextContent = textContent;
  }

  protected get textContent(): string | null {
    if (this.wrappedTextContent === undefined) {
      throw new Error(`wrappedTextContent is undefined.`);
    }

    return this.wrappedTextContent;
  }

  protected set price(price: number | null) {
    this.wrappedPrice = price;
  }

  protected get price(): number | null {
    if (this.wrappedPrice === undefined) {
      throw new Error(`wrappedPrice is undefined.`);
    }

    return this.wrappedPrice;
  }

  protected set value(value: number | null) {
    this.wrappedValue = value;
  }

  protected get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error(`wrappedValue is undefined.`);
    }

    return this.wrappedValue;
  }
}