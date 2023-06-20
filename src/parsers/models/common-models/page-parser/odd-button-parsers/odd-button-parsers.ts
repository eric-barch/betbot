import { ElementHandle, Page } from 'puppeteer';
import { Exchange, League } from '@prisma/client';

import { IPageParser } from '@/parsers/models/common-models';

import { OddButtonParser } from './odd-button-parser';

export interface IOddButtonParserSet {
  oddButtonParsers: Set<OddButtonParser>;
  generateOddButtonSelector(): Promise<string>;
  createOddButtonParsers(): Promise<Set<OddButtonParser>>;
  updateOdds(): Promise<void>;
}

export class CommonOddButtonParserSet {
  private readonly parentPageParser: IPageParser;
  private readonly parentOddButtonParserSet: IOddButtonParserSet;
  private wrappedOddButtonSelector: string | undefined;
  private wrappedButtons: Array<ElementHandle> | undefined;

  private constructor({
    parentPageParser,
    parentOddButtonParserSet,
  }: {
    parentPageParser: IPageParser,
    parentOddButtonParserSet: IOddButtonParserSet,
  }) {
    this.parentPageParser = parentPageParser;
    this.parentOddButtonParserSet = parentOddButtonParserSet;
  }

  public static async create({
    parentPageParser,
    parentOddButtonParserSet,
  }: {
    parentPageParser: IPageParser,
    parentOddButtonParserSet: IOddButtonParserSet,
  }): Promise<CommonOddButtonParserSet> {
    const commonOddButtonParserSet = new CommonOddButtonParserSet({
      parentPageParser,
      parentOddButtonParserSet,
    });

    commonOddButtonParserSet.oddButtonSelector = await parentOddButtonParserSet.generateOddButtonSelector();
    commonOddButtonParserSet.buttons = await commonOddButtonParserSet.scrapeButtons();

    return commonOddButtonParserSet;
  }

  public async scrapeButtons(): Promise<Array<ElementHandle>> {
    const page = this.parentPageParser.page;
    this.buttons = await page.$$(this.oddButtonSelector);
    return this.buttons;
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

  private get oddButtonParsers(): Set<OddButtonParser> {
    return this.parentOddButtonParserSet.oddButtonParsers;
  }

  private set buttons(buttons: Array<ElementHandle>) {
    this.wrappedButtons = buttons;
  }

  public get buttons(): Array<ElementHandle> {
    if (!this.wrappedButtons) {
      throw new Error(`wrappedButtons is undefined.`);
    }

    return this.wrappedButtons;
  }
}