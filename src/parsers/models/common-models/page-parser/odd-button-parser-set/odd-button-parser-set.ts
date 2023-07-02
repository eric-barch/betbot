import { ElementHandle } from 'puppeteer';

import { OddButtonParser, PageParser } from '@/parsers/models/common-models';
import { loopInParallel } from '@/setup';

export interface SpecializedOddButtonParserSet {
  generateOddButtonSelector(): Promise<string>;
}

export class OddButtonParserSet {
  private readonly parentPageParser: PageParser;
  private wrappedSpecializedOddButtonParserSet: SpecializedOddButtonParserSet | undefined;
  private wrappedOddButtonSelector: string | undefined;
  private wrappedButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser> | undefined;

  private constructor({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }) {
    this.parentPageParser = parentPageParser;
  }

  public static async create({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<OddButtonParserSet> {
    const oddButttonParserSet = new OddButtonParserSet({ parentPageParser });
    await oddButttonParserSet.init();
    return oddButttonParserSet;
  }

  private async init(): Promise<OddButtonParserSet> {
    this.specializedOddButtonParserSet = await this
      .parentPageParser
      .specializedParserFactory
      .createOddButtonParserSet({
        parentOddButtonParserSet: this,
      });
    this.oddButtonSelector = await this.specializedOddButtonParserSet.generateOddButtonSelector();
    this.oddButtons = await this.scrapeOddButtons();
    this.oddButtonParsers = await this.createOddButtonParsers();
    return this;
  }

  private async scrapeOddButtons(): Promise<Array<ElementHandle>> {
    this.oddButtons = await this.parentPageParser.page.$$(this.oddButtonSelector);
    return this.oddButtons;
  }

  private async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    this.oddButtonParsers = new Set<OddButtonParser>();

    /**Do not run in parallel. PageParsers must be created in series to avoid dual entries in db. */
    for (const oddButton of this.oddButtons) {
      const oddButtonParser = await OddButtonParser.create({
        parentPageParser: this.parentPageParser,
        initializationButton: oddButton,
      });
      this.oddButtonParsers.add(oddButtonParser);
    }

    return this.oddButtonParsers;
  }

  public async update(): Promise<void> {
    if (loopInParallel) {
      await Promise.all(
        Array.from(this.oddButtonParsers).map(async (oddButtonParser) => {
          await oddButtonParser.update();
        })
      );
    }

    if (!loopInParallel) {
      for (const oddButtonParser of this.oddButtonParsers) {
        await oddButtonParser.update();
      }
    }
  };

  public async disconnect(): Promise<void> {
    if (loopInParallel) {
      await Promise.all(
        Array.from(this.oddButtonParsers).map(async (oddButtonParser) => {
          await oddButtonParser.disconnect();
        })
      );
    }

    if (!loopInParallel) {
      for (const oddButtonParser of this.oddButtonParsers) {
        await oddButtonParser.disconnect();
      }
    }
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