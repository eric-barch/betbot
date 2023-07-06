import { ElementHandle } from 'puppeteer';

import { OddButtonParser, PageParser } from '@/parsers/models/common-models';
import { loopInParallel } from '@/setup';

export abstract class OddButtonParserSet {
  public readonly parent: PageParser;
  private wrappedOddButtonSelector: string | undefined;
  private wrappedOddButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser> | undefined;

  protected constructor({
    parent,
  }: {
    parent: PageParser,
  }) {
    this.parent = parent;
  }

  protected async init(): Promise<OddButtonParserSet> {
    this.oddButtonSelector = await this.generateOddButtonSelector();
    this.oddButtons = await this.scrapeOddButtons();
    this.oddButtonParsers = await this.createOddButtonParsers();
    return this;
  }

  protected abstract generateOddButtonSelector(): Promise<string>;

  private async scrapeOddButtons(): Promise<Array<ElementHandle>> {
    this.oddButtons = await this.parent.page.$$(this.oddButtonSelector);
    return this.oddButtons;
  }

  private async createOddButtonParsers(): Promise<Set<OddButtonParser>> {
    this.oddButtonParsers = new Set<OddButtonParser>();

    /**Do not run in parallel. PageParsers must be created in series to avoid dual entries in db. */
    for (const oddButton of this.oddButtons) {
      const oddButtonParser = await OddButtonParser.create({
        parent: this.parent,
        initializationButton: oddButton,
      });
      this.oddButtonParsers.add(oddButtonParser);
    }

    return this.oddButtonParsers;
  }

  public async update(): Promise<OddButtonParserSet> {
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

    return this;
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

  protected set oddButtonSelector(oddButtonSelector: string) {
    this.wrappedOddButtonSelector = oddButtonSelector;
  }

  protected get oddButtonSelector(): string {
    if (!this.wrappedOddButtonSelector) {
      throw new Error(`wrappedOddButtonSelector is undefined.`);
    }

    return this.wrappedOddButtonSelector;
  }

  private set oddButtons(oddButtons: Array<ElementHandle>) {
    this.wrappedOddButtons = oddButtons;
  }

  private get oddButtons(): Array<ElementHandle> {
    if (!this.wrappedOddButtons) {
      throw new Error(`wrappedOddButtons is undefined.`);
    }

    return this.wrappedOddButtons;
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