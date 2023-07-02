import { Odd, Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import {
  OddButtonParserDbConnection, OddButtonWrapper, PageParser, SpecializedParserFactory, TextContentParser,
} from '@/parsers/models/common-models';

export interface SpecializedOddButtonParser {
  update(): Promise<Odd>;
}

export class OddButtonParser {
  public readonly parentPageParser: PageParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private readonly initializationButton: ElementHandle;
  private wrappedSpecializedOddButtonParser: SpecializedOddButtonParser | undefined;
  private wrappedOddButtonWrapper: OddButtonWrapper | undefined;
  private wrappedDbConnection: OddButtonParserDbConnection | undefined;
  private wrappedTextContentParser: TextContentParser | undefined;

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
    this.dbConnection = await OddButtonParserDbConnection.create({
      parentOddButtonParser: this,
      specializedParserFactory: this.specializedParserFactory,
    });
    this.textContentParser = await TextContentParser.create({
      parentOddButtonParser: this,
    });
    return this;
  }

  public async update(): Promise<void> {
    try {
      await this.specializedOddButtonParser.update();
    } catch {
      await this.reset();
    }
  }

  public async resetOddButtonFromReference(): Promise<void> {
    await this.oddButtonWrapper.resetFromReference();
  }

  public async writeTextContentToDbOdd(): Promise<Odd> {
    await this.textContentParser.parse();

    const price = this.textContentParser.price;
    const value = this.textContentParser.value;

    await this.dbConnection.update({
      price,
      value,
    });

    return this.odd;
  }

  private async reset(): Promise<void> {
    await this.dbConnection.reset();
  }

  public async disconnect(): Promise<void> {
    await this.dbConnection.disconnect();
  }

  public get button(): ElementHandle {
    return this.oddButtonWrapper.oddButton;
  }

  public get game(): GameWithTeams {
    return this.dbConnection.game;
  }

  public get statistic(): Statistic {
    return this.dbConnection.statistic;
  }

  public get odd(): Odd {
    return this.dbConnection.odd;
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

  private set dbConnection(dbConnection: OddButtonParserDbConnection) {
    this.wrappedDbConnection = dbConnection;
  }

  private get dbConnection(): OddButtonParserDbConnection {
    if (this.wrappedDbConnection === undefined) {
      throw new Error(`wrappedDbConnection is undefined.`);
    }

    return this.wrappedDbConnection;
  }

  private set textContentParser(textContentParser: TextContentParser) {
    this.wrappedTextContentParser = textContentParser;
  }

  private get textContentParser(): TextContentParser {
    if (this.wrappedTextContentParser === undefined) {
      throw new Error(`wrappedTextContentParser is undefined.`);
    }

    return this.wrappedTextContentParser;
  }
}