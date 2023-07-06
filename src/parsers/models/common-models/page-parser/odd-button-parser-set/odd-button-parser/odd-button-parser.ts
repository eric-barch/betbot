import { Odd, Statistic } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameWithTeams } from '@/db';
import {
  OddButtonParserDbConnection, OddButtonWrapper, PageParser, TextContentParser
} from '@/parsers/models/common-models';

export class OddButtonParser {
  public readonly parent: PageParser;
  private readonly initializationButton: ElementHandle;
  private wrappedOddButtonWrapper: OddButtonWrapper | undefined;
  private wrappedDbConnection: OddButtonParserDbConnection | undefined;
  private wrappedTextContentParser: TextContentParser | undefined;

  private constructor({
    parent,
    initializationButton,
  }: {
    parent: PageParser,
    initializationButton: ElementHandle,
  }) {
    this.parent = parent;
    this.initializationButton = initializationButton;
  }

  public static async create({
    parent,
    initializationButton,
  }: {
    parent: PageParser,
    initializationButton: ElementHandle,
  }): Promise<OddButtonParser> {
    const commonOddButtonParser = new OddButtonParser({
      parent,
      initializationButton,
    });
    await commonOddButtonParser.init();
    return commonOddButtonParser;
  }

  private async init(): Promise<OddButtonParser> {
    this.textContentParser = TextContentParser.create({
      parentOddButtonParser: this,
    });
    this.oddButtonWrapper = await this.parent.specializedParserFactory.createOddButtonWrapper({
      parent: this,
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
    } catch (error) {
      console.log(`dbConnection.create failed. Leaving undefined. ${error}`);
    }

    return this;
  }

  public async update(): Promise<OddButtonParser> {
    try {
      await this.oddButtonWrapper.resetFromReference();
      await this.writeTextContentToDb();
    } catch {
      await this.tryToConnectToDb();
    }

    return this;
  }

  public async writeTextContentToDb(): Promise<OddButtonParser> {
    await this.textContentParser.parse();

    await this.dbConnection.update({
      price: this.textContentParser.price,
      value: this.textContentParser.value,
    });

    return this;
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