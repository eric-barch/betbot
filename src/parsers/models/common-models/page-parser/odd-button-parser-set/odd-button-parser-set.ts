import { ElementHandle } from 'puppeteer';

import { PageParser } from '@/parsers/models/common-models';

import { ParserFactory } from '../../parser-factory';

import { OddButtonParser, SpecializedOddButtonParser } from './odd-button-parser';

export interface SpecializedOddButtonParserSet {
  generateOddButtonSelector(): Promise<string>;
  updateOdds(): Promise<void>;
}

export class OddButtonParserSet {
  private readonly parentPageParser: PageParser;
  private readonly parserFactory: ParserFactory;
  private wrappedSpecializedOddButtonParserSet: SpecializedOddButtonParserSet | undefined;
  private wrappedOddButtonSelector: string | undefined;
  private wrappedButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser> | undefined;

  private constructor({
    parentPageParser,
    parserFactory,
  }: {
    parentPageParser: PageParser,
    parserFactory: ParserFactory,
  }) {
    this.parentPageParser = parentPageParser;
    this.parserFactory = parserFactory;
  }

  public static async create({
    parentPageParser,
    parserFactory,
  }: {
    parentPageParser: PageParser,
    parserFactory: ParserFactory,
  }): Promise<OddButtonParserSet> {
    const commonOddButtonParserSet = new OddButtonParserSet({
      parentPageParser,
      parserFactory,
    });
    await commonOddButtonParserSet.init();
    return commonOddButtonParserSet;
  }

  private async init(): Promise<OddButtonParserSet> {
    this.specializedOddButtonParserSet = await this.parserFactory.createOddButtonParserSet();
    this.oddButtonSelector = await this.specializedOddButtonParserSet.generateOddButtonSelector();
    this.oddButtons = await this.scrapeOddButtons();
    this.oddButtonParsers = await this.createOddButtonParsers();

    return this;
  }

  private async scrapeOddButtons(): Promise<Array<ElementHandle>> {
    const page = this.parentPageParser.page;
    this.oddButtons = await page.$$(this.oddButtonSelector);
    return this.oddButtons;
  }

  private async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    this.oddButtonParsers = new Set<OddButtonParser>();

    // Run in series (development)
    for (const button of this.oddButtons) {
      const oddButtonParser = await OddButtonParser.create({
        parentPageParser: this.parentPageParser,
        parserFactory: this.parserFactory,
        initializationButton: button,
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

  private set specializedOddButtonParserSet(specializedOddButtonParserSet: SpecializedOddButtonParserSet) {
    this.wrappedSpecializedOddButtonParserSet = specializedOddButtonParserSet;
  }

  private get specializedOddButtonParserSet(): SpecializedOddButtonParserSet {
    if (!this.wrappedSpecializedOddButtonParserSet) {
      throw new Error(`wrappedSpecializedOddButtonParserSet is undefined.`);
    }

    return this.wrappedSpecializedOddButtonParserSet;
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

  private set oddButtons(buttons: Array<ElementHandle>) {
    this.wrappedButtons = buttons;
  }

  private get oddButtons(): Array<ElementHandle> {
    if (!this.wrappedButtons) {
      throw new Error(`wrappedButtons is undefined.`);
    }

    return this.wrappedButtons;
  }

  private set oddButtonParsers(oddButtonParsers: Set<OddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  private get oddButtonParsers(): Set<OddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }
}