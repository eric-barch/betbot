import { ElementHandle } from 'puppeteer';

import { Exchange, League } from '@prisma/client';
import { OddButtonParser } from './odd-button-parser';

export abstract class OddButtonParsers {
  protected readonly exchange: Exchange;
  protected readonly league: League;
  private wrappedButtons: Array<ElementHandle> | undefined;
  private wrappedOddButtonParsers: Set<OddButtonParser> | undefined;

  protected constructor({
    exchange,
    league,
  }: {
    exchange: Exchange,
    league: League,
  }) {
    this.exchange = exchange;
    this.league = league;
  }

  protected async init(): Promise<OddButtonParsers> {
    this.buttons = await this.scrapeButtons();
    this.oddButtonParsers = await this.createOddButtonParsers();
    return this;
  }

  protected abstract scrapeButtons(): Promise<Array<ElementHandle>>;

  protected abstract createOddButtonParsers(): Promise<Set<OddButtonParser>>;

  public async updateOddData(): Promise<OddButtonParsers> {
    for (const oddButtonParser of this.oddButtonParsers) {
      await oddButtonParser.updateOddData();
    }

    return this;
  };

  protected set oddButtonParsers(oddButtonParsers: Set<OddButtonParser>) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  protected get oddButtonParsers(): Set<OddButtonParser> {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }

  protected set buttons(buttons: Array<ElementHandle>) {
    this.wrappedButtons = buttons;
  }

  protected get buttons(): Array<ElementHandle> {
    if (!this.wrappedButtons) {
      throw new Error(`wrappedButtons is undefined.`);
    }

    return this.wrappedButtons;
  }
}