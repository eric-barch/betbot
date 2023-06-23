import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import {
  DbGameInitializer, DbOddInitializer, DbStatisticInitializer, OddButtonWrapper, PageParser,
  ParserFactory,
  SpecializedParserFactory,
} from '@/parsers/models/common-models';
import { GameWithTeams } from '@/db';

export interface SpecializedOddButtonParser {
  updateOdd(): Promise<void>;
}

export class OddButtonParser {
  private readonly parentPageParser: PageParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private readonly initializationButton: ElementHandle;
  private wrappedSpecializedOddButtonParser: SpecializedOddButtonParser | undefined;
  private wrappedOddButtonWrapper: OddButtonWrapper | undefined;
  private wrappedDbGameInitializer: DbGameInitializer | undefined;
  private wrappedDbStatisticInitializer: DbStatisticInitializer | undefined;
  private wrappedDbOddInitializer: DbOddInitializer | undefined;
  private wrappedTextContent: string | null | undefined;
  private wrappedPrice: number | null | undefined;
  private wrappedValue: number | null | undefined;

  private constructor({
    parentPageParser,
    specializedParserFactory,
    initializationButton,
  }: {
    parentPageParser: PageParser,
    specializedParserFactory: SpecializedParserFactory,
    initializationButton: ElementHandle,
  }) {
    this.parentPageParser = parentPageParser;
    this.specializedParserFactory = specializedParserFactory;
    this.initializationButton = initializationButton;
  }

  public static async create({
    parentPageParser,
    specializedParserFactory,
    initializationButton,
  }: {
    parentPageParser: PageParser,
    specializedParserFactory: SpecializedParserFactory,
    initializationButton: ElementHandle,
  }): Promise<OddButtonParser> {
    const commonOddButtonParser = new OddButtonParser({
      parentPageParser,
      specializedParserFactory,
      initializationButton,
    });
    await commonOddButtonParser.init();
    return commonOddButtonParser;
  }

  private async init(): Promise<OddButtonParser> {
    this.specializedOddButtonParser = await this.specializedParserFactory.createOddButtonParser({
      parentPageParser: this.parentPageParser,
      parentOddButtonParser: this,
    });
    this.oddButtonWrapper = await OddButtonWrapper.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
      initializationButton: this.initializationButton,
    });
    this.dbGameInitializer = await DbGameInitializer.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    this.dbStatisticInitializer = await DbStatisticInitializer.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    this.dbOddInitializer = await DbOddInitializer.create({ parentOddButtonParser: this });

    return this;
  }

  public async updateOdd() {
    await this.specializedOddButtonParser.updateOdd();
  }

  public async resetOddButtonFromReference(): Promise<void> {
    await this.oddButtonWrapper.resetOddButtonFromReference();
  }

  public async updateDbOddFromOddButtonTextContent(): Promise<void> {
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


  public get exchange(): Exchange {
    return this.parentPageParser.exchange;
  }

  public get league(): League {
    return this.parentPageParser.league;
  }

  public get button(): ElementHandle {
    return this.oddButtonWrapper.oddButton;
  }

  public get game(): GameWithTeams {
    return this.dbGameInitializer.game;
  }

  public get statistic(): Statistic {
    return this.dbStatisticInitializer.statistic;
  }

  public get odd(): Odd {
    return this.dbOddInitializer.odd;
  }

  public get price(): number | null {
    if (this.wrappedPrice === undefined) {
      throw new Error(`wrappedPrice is undefined.`);
    }

    return this.wrappedPrice;
  }

  public get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error(`wrappedValue is undefined.`);
    }

    return this.wrappedValue;
  }

  private set specializedOddButtonParser(specializedOddButtonParser: SpecializedOddButtonParser) {
    this.wrappedSpecializedOddButtonParser = specializedOddButtonParser;
  }

  private get specializedOddButtonParser(): SpecializedOddButtonParser {
    if (!this.wrappedSpecializedOddButtonParser) {
      throw new Error(`wrappedSpecializedOddButtonParser is undefined.`);
    }

    return this.wrappedSpecializedOddButtonParser;
  }

  private set oddButtonWrapper(oddButtonWrapper: OddButtonWrapper) {
    this.wrappedOddButtonWrapper = oddButtonWrapper;
  }

  private get oddButtonWrapper(): OddButtonWrapper {
    if (!this.wrappedOddButtonWrapper) {
      throw new Error(`wrappedOddButtonWrapper is undefined.`);
    }

    return this.wrappedOddButtonWrapper;
  }

  private set dbGameInitializer(dbGameInitializer: DbGameInitializer) {
    this.wrappedDbGameInitializer = dbGameInitializer;
  }

  private get dbGameInitializer(): DbGameInitializer {
    if (!this.wrappedDbGameInitializer) {
      throw new Error(`wrappedDbGameInitializer is undefined.`);
    }

    return this.wrappedDbGameInitializer;
  }

  private set dbStatisticInitializer(dbStatisticInitializer: DbStatisticInitializer) {
    this.wrappedDbStatisticInitializer = dbStatisticInitializer;
  }

  private get dbStatisticInitializer(): DbStatisticInitializer {
    if (!this.wrappedDbStatisticInitializer) {
      throw new Error(`wrappedDbStatisticInitializer is undefined.`);
    }

    return this.wrappedDbStatisticInitializer;
  }

  private set dbOddInitializer(dbOddInitializer: DbOddInitializer) {
    this.wrappedDbOddInitializer = dbOddInitializer;
  }

  private get dbOddInitializer(): DbOddInitializer {
    if (!this.wrappedDbOddInitializer) {
      throw new Error(`wrappedDbOddInitializer is undefined.`);
    }

    return this.wrappedDbOddInitializer;
  }

  private set textContent(textContent: string | null) {
    this.wrappedTextContent = textContent;
  }

  private get textContent(): string | null {
    if (this.wrappedTextContent === undefined) {
      throw new Error(`wrappedTextContent is undefined.`);
    }

    return this.wrappedTextContent;
  }

  private set price(price: number | null) {
    this.wrappedPrice = price;
  }

  private set value(value: number | null) {
    this.wrappedValue = value;
  }
}