import { ElementHandle, Page } from 'puppeteer';
import { Exchange, League } from '@prisma/client';

import { PageParser } from '@/parsers/models/common-models';

import { ParserFactory } from '../../parser-factory';

import { CommonOddButtonParser, SpecializedOddButtonParser } from './odd-button-parser';

export interface SpecializedOddButtonParserSet {
  generateOddButtonSelector(): Promise<string>;
  updateOdds(): Promise<void>;
}

export class CommonOddButtonParserSet {
  private readonly parentPageParser: PageParser;
  private readonly parserFactory: ParserFactory;
  private readonly specializedOddButtonParserSet: SpecializedOddButtonParserSet;
  private wrappedOddButtonSelector: string | undefined;
  private wrappedButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<SpecializedOddButtonParser> | undefined;

  private constructor({
    parentPageParser,
    parserFactory,
    specializedOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parserFactory: ParserFactory,
    specializedOddButtonParserSet: SpecializedOddButtonParserSet,
  }) {
    this.parentPageParser = parentPageParser;
    this.parserFactory = parserFactory;
    this.specializedOddButtonParserSet = specializedOddButtonParserSet;
  }

  public static async create({
    parentPageParser,
    parserFactory,
    specializedOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parserFactory: ParserFactory,
    specializedOddButtonParserSet: SpecializedOddButtonParserSet,
  }): Promise<CommonOddButtonParserSet> {
    const commonOddButtonParserSet = new CommonOddButtonParserSet({
      parentPageParser,
      parserFactory,
      specializedOddButtonParserSet,
    });
    await commonOddButtonParserSet.init();
    return commonOddButtonParserSet;
  }

  private async init(): Promise<CommonOddButtonParserSet> {
    this.oddButtonSelector = await this.specializedOddButtonParserSet.generateOddButtonSelector();
    this.buttons = await this.scrapeButtons();
    this.oddButtonParsers = await this.createOddButtonParsers();

    return this;
  }

  private async scrapeButtons(): Promise<Array<ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttons = await page.$$(this.oddButtonSelector);
    return this.buttons;
  }

  private async createOddButtonParsers(): Promise<Set<SpecializedOddButtonParser>> {
    this.oddButtonParsers = new Set<SpecializedOddButtonParser>();

    // Run in series (development)
    for (const button of this.buttons) {
      const oddButtonParser = await this.parserFactory.createOddButtonParser({
        parentPageParser: this.parentPageParser,
        button,
      });
      this.oddButtonParsers.add(oddButtonParser);
    }

    // Run in parallel (production)
    // await Promise.all(
    //   this.buttons.map(async (button) => {
    //     const oddButtonParser = await this.parentPageParser.parserFactory.createOddButtonParser({
    //       exchange: this.parentPageParser.exchange,
    //       league: this.parentPageParser.league,
    //       button,
    //     });
    //     this.oddButtonParsers.add(oddButtonParser);
    //   })
    // );

    return this.oddButtonParsers;
  }

  public async updateOdds(): Promise<void> {
    await Promise.all(
      Array.from(this.oddButtonParsers).map(oddButtonParser => oddButtonParser.updateOdd())
    );
  };

  public get page(): Page {
    return this.parentPageParser.page;
  }

  public get exchange(): Exchange {
    return this.parentPageParser.exchange;
  }

  public get league(): League {
    return this.parentPageParser.league;
  }

  private set oddButtonSelector(oddButtonSelector: string) {
    this.wrappedOddButtonSelector = oddButtonSelector;
  }

  private get oddButtonSelector(): string {
    if (!this.wrappedOddButtonSelector) {
      throw new Error(`wrappedOddButtonSelector is undefined.`);
    }

    return this.wrappedOddButtonSelector;
  }

  private set buttons(buttons: Array<ElementHandle>) {
    this.wrappedButtons = buttons;
  }

  private get buttons(): Array<ElementHandle> {
    if (!this.wrappedButtons) {
      throw new Error(`wrappedButtons is undefined.`);
    }

    return this.wrappedButtons;
  }

  private set oddButtonParsers(oddButtonParsers: Set<SpecializedOddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  private get oddButtonParsers(): Set<SpecializedOddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }
}