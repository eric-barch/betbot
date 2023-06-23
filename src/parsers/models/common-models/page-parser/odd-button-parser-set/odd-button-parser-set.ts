import { ElementHandle } from 'puppeteer';

import { OddButtonParser, PageParser, SpecializedParserFactory } from '@/parsers/models/common-models';

export interface SpecializedOddButtonParserSet {
  generateOddButtonSelector(): Promise<string>;
  updateOdds(): Promise<void>;
}

export class OddButtonParserSet {
  private readonly parentPageParser: PageParser;
  private readonly specializedParserFactory: SpecializedParserFactory;
  private wrappedSpecializedOddButtonParserSet: SpecializedOddButtonParserSet | undefined;
  private wrappedOddButtonSelector: string | undefined;
  private wrappedButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser> | undefined;

  private constructor({
    parentPageParser,
    specializedParserFactory,
  }: {
    parentPageParser: PageParser,
    specializedParserFactory: SpecializedParserFactory,
  }) {
    this.parentPageParser = parentPageParser;
    this.specializedParserFactory = specializedParserFactory;
  }

  public static async create({
    parentPageParser,
    specializedParserFactory,
  }: {
    parentPageParser: PageParser,
    specializedParserFactory: SpecializedParserFactory,
  }): Promise<OddButtonParserSet> {
    const commonOddButtonParserSet = new OddButtonParserSet({
      parentPageParser,
      specializedParserFactory,
    });
    await commonOddButtonParserSet.init();
    return commonOddButtonParserSet;
  }

  private async init(): Promise<OddButtonParserSet> {
    this.specializedOddButtonParserSet = await this.specializedParserFactory.createOddButtonParserSet({
      parentPageParser: this.parentPageParser,
      parentOddButtonParserSet: this,
    });
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
    // for (const oddButton of this.oddButtons) {
    //   const oddButtonParser = await OddButtonParser.create({
    //     parentPageParser: this.parentPageParser,
    //     specializedParserFactory: this.specializedParserFactory,
    //     initializationButton: oddButton,
    //   });
    //   this.oddButtonParsers.add(oddButtonParser);
    // }

    // Run in parallel (production)
    await Promise.all(
      this.oddButtons.map(async (oddButton) => {
        const oddButtonParser = await OddButtonParser.create({
          parentPageParser: this.parentPageParser,
          specializedParserFactory: this.specializedParserFactory,
          initializationButton: oddButton,
        });
        this.oddButtonParsers.add(oddButtonParser);
      })
    );

    return this.oddButtonParsers;
  }

  public async updateOdds(): Promise<void> {
    // Run in series (development)
    // for (const oddButtonParser of this.oddButtonParsers) {
    //   await oddButtonParser.updateOdd();
    // }

    // Run in parallel (production)
    await Promise.all(Array.from(this.oddButtonParsers).map(oddButtonParser => oddButtonParser.updateOdd()));
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