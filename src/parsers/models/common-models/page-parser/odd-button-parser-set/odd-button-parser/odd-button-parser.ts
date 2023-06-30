import { Exchange, League, Odd, Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import {
  DbGameConnection, DbOddConnection, DbStatisticConnection, OddButtonWrapper, PageParser,
  SpecializedParserFactory
} from '@/parsers/models/common-models';

export interface SpecializedOddButtonParser {
  update(): Promise<Odd>;
}

export class OddButtonParser {
  private readonly parentPageParser: PageParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private readonly initializationButton: ElementHandle;
  private wrappedSpecializedOddButtonParser: SpecializedOddButtonParser | undefined;
  private wrappedOddButtonWrapper: OddButtonWrapper | undefined;
  private wrappedDbGameConnection: DbGameConnection | undefined;
  private wrappedDbStatisticConnection: DbStatisticConnection | undefined;
  private wrappedDbOddConnection: DbOddConnection | undefined;
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
      parentOddButtonParser: this,
    });
    this.oddButtonWrapper = await OddButtonWrapper.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
      initializationButton: this.initializationButton,
    });

    try {
      await this.createDbConnections();
    } catch { }

    return this;
  }

  private async createDbConnections(): Promise<void> {
    this.dbGameConnection = await DbGameConnection.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    this.dbStatisticConnection = await DbStatisticConnection.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    this.dbOddConnection = await DbOddConnection.create({
      parentOddButtonParser: this,
    });
  }

  private async reset(): Promise<OddButtonParser> {
    try {
      await this.createDbConnections();
      console.log(`OddButtonParser reset.`);
    } catch { }

    return this;
  }

  public async update(): Promise<void> {
    try {
      await this.specializedOddButtonParser.update();
    } catch {
      await this.reset();
    }
  }

  public async disconnect(): Promise<Odd> {
    return await this.dbOddConnection.disconnect();
  }

  public async resetOddButtonFromReference(): Promise<ElementHandle> {
    return await this.oddButtonWrapper.resetFromReference();
  }

  public async writeTextContentToDbOdd(): Promise<Odd> {
    await this.parseTextContent();

    return await this.dbOddConnection.update({
      price: this.price,
      value: this.value,
    });
  }

  private async parseTextContent(): Promise<void> {
    this.textContent = await this.button.evaluate(el => el.textContent);

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
    return this.dbGameConnection.game;
  }

  public get statistic(): Statistic {
    if (this.dbStatisticConnection.statistic === null) {
      throw new Error(`statistic is null.`);
    }

    return this.dbStatisticConnection.statistic;
  }

  public get odd(): Odd {
    return this.dbOddConnection.odd;
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

  private set dbGameConnection(dbGameConnection: DbGameConnection) {
    this.wrappedDbGameConnection = dbGameConnection;
  }

  private get dbGameConnection(): DbGameConnection {
    if (!this.wrappedDbGameConnection) {
      throw new Error(`wrappedDbGameConnection is undefined.`);
    }

    return this.wrappedDbGameConnection;
  }

  private set dbStatisticConnection(dbStatisticConnection: DbStatisticConnection) {
    this.wrappedDbStatisticConnection = dbStatisticConnection;
  }

  private get dbStatisticConnection(): DbStatisticConnection {
    if (!this.wrappedDbStatisticConnection) {
      throw new Error(`wrappedDbStatisticConnection is undefined.`);
    }

    return this.wrappedDbStatisticConnection;
  }

  private set dbOddConnection(dbOddConnection: DbOddConnection) {
    this.wrappedDbOddConnection = dbOddConnection;
  }

  private get dbOddConnection(): DbOddConnection {
    if (!this.wrappedDbOddConnection) {
      throw new Error(`wrappedDbOddConnection is undefined.`);
    }

    return this.wrappedDbOddConnection;
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

  private get price(): number | null {
    if (this.wrappedPrice === undefined) {
      throw new Error(`wrappedPrice is undefined.`);
    }

    return this.wrappedPrice;
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