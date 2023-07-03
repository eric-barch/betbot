import { Odd, Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import {
  OddButtonParserDbConnection, OddButtonWrapper, PageParser, TextContentParser
} from '@/parsers/models/common-models';

export interface SpecializedOddButtonParser {
  update(): Promise<Odd>;
}

export class OddButtonParser {
  public readonly parentPageParser: PageParser;
  private readonly initializationButton: ElementHandle;
  private wrappedSpecializedOddButtonParser: SpecializedOddButtonParser | undefined;
  private wrappedOddButtonWrapper: OddButtonWrapper | undefined;
  private wrappedDbConnection: OddButtonParserDbConnection | undefined;
  private wrappedTextContentParser: TextContentParser | undefined;

  private constructor({
    parentPageParser,
    initializationButton,
  }: {
    parentPageParser: PageParser,
    initializationButton: ElementHandle,
  }) {
    this.parentPageParser = parentPageParser;
    this.initializationButton = initializationButton;
  }

  public static async create({
    parentPageParser,
    initializationButton,
  }: {
    parentPageParser: PageParser,
    initializationButton: ElementHandle,
  }): Promise<OddButtonParser> {
    const commonOddButtonParser = new OddButtonParser({
      parentPageParser,
      initializationButton,
    });
    await commonOddButtonParser.init();
    return commonOddButtonParser;
  }

  private async init(): Promise<OddButtonParser> {
    this.specializedOddButtonParser = await this
      .parentPageParser
      .specializedParserFactory
      .createOddButtonParser({
        parentOddButtonParser: this,
      });
    this.textContentParser = TextContentParser.create({
      parentOddButtonParser: this,
    });
    this.oddButtonWrapper = await OddButtonWrapper.create({
      parentOddButtonParser: this,
      oddButton: this.initializationButton,
    });
    await this.tryToConnectToDb();
    return this;
  }

  private async tryToConnectToDb(): Promise<OddButtonParser> {
    try {
      this.dbConnection = await OddButtonParserDbConnection.create({
        parentOddButtonParser: this,
      });
    } catch {
      console.log(`dbConnection.create failed. Leaving undefined.`);
    }

    return this;
  }

  public async update(): Promise<OddButtonParser> {
    try {
      await this.specializedOddButtonParser.update();
    } catch {
      await this.tryToConnectToDb();
    }

    return this;
  }

  public async resetOddButtonFromReference(): Promise<OddButtonParser> {
    await this.oddButtonWrapper.resetFromReference();
    return this;
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