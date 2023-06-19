import { ElementHandle } from 'puppeteer';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';

import { DataParser } from './data-parser';
import { DbGameInitializer, DbOddInitializer, DbStatisticInitializer } from './db-initializers';
import { OddButton } from './odd-button';

export abstract class OddButtonParser {
  public readonly exchange: Exchange;
  public readonly league: League;
  // TODO: Hacky.
  public readonly seedButton: ElementHandle;
  private wrappedOddButton: OddButton | undefined;
  private wrappedDbGameInitializer: DbGameInitializer | undefined;
  private wrappedDbStatisticInitializer: DbStatisticInitializer | undefined;
  private wrappedDbOddInitializer: DbOddInitializer | undefined;
  private wrappedTextContent: string | null | undefined;
  private wrappedPrice: number | null | undefined;
  private wrappedValue: number | null | undefined;

  protected constructor({
    exchange,
    league,
    button,
  }: {
    exchange: Exchange,
    league: League,
    button: ElementHandle,
  }) {
    this.exchange = exchange;
    this.league = league;
    this.seedButton = button;
  }

  protected abstract init(): Promise<OddButtonParser>;

  public abstract updateOdd(): Promise<OddButtonParser>;

  protected async updateDbOddFromTextContent(): Promise<void> {
    await this.getTextContent();
    await this.parseTextContent();

    await this.dbOddInitializer.updateData({
      price: this.price,
      value: this.value,
    });
  }

  private async getTextContent(): Promise<string | null> {
    this.textContent = await (await this.button.getProperty('textContent')).jsonValue();
    return this.textContent;
  }

  private async parseTextContent(): Promise<void> {
    if (!this.textContent) {
      this.value = null;
      this.price = null;
      return;
    }

    // Normalize minus signs
    const allHyphens = '−-−‐‑‒–—―';
    const normalizedMinusSign = this.textContent.replace(new RegExp(`[${allHyphens}]`, 'g'), '-');

    const numbers = normalizedMinusSign.match(/-?\d+(\.\d+)?/g);

    if (!numbers) {
      this.value = null;
      this.price = null;
      return;
    }

    if (numbers.length === 1) {
      this.value = null;
      this.price = parseInt(numbers[0]);
      return;
    }

    if (numbers.length === 2) {
      this.value = parseFloat(numbers[0]);
      this.price = parseInt(numbers[1]);
      return;
    }

    throw new Error(`More than two numbers found in textContent.`);
  }

  protected set oddButton(oddButton: OddButton) {
    this.wrappedOddButton = oddButton;
  }

  protected get oddButton(): OddButton {
    if (!this.wrappedOddButton) {
      throw new Error(`wrappedOddButton is undefined.`);
    }

    return this.wrappedOddButton;
  }

  public get button(): ElementHandle {
    return this.oddButton.button;
  }

  protected set dbGameInitializer(dbGameInitializer: DbGameInitializer) {
    this.wrappedDbGameInitializer = dbGameInitializer;
  }

  protected get dbGameInitializer(): DbGameInitializer {
    if (!this.wrappedDbGameInitializer) {
      throw new Error(`wrappedDbGameInitializer is undefined.`);
    }

    return this.wrappedDbGameInitializer;
  }

  public get game(): Game {
    return this.dbGameInitializer.game;
  }

  protected set dbStatisticInitializer(dbStatisticInitializer: DbStatisticInitializer) {
    this.wrappedDbStatisticInitializer = dbStatisticInitializer;
  }

  protected get dbStatisticInitializer(): DbStatisticInitializer {
    if (!this.wrappedDbStatisticInitializer) {
      throw new Error(`wrappedDbStatisticInitializer is undefined.`);
    }

    return this.wrappedDbStatisticInitializer;
  }

  public get statistic(): Statistic {
    return this.dbStatisticInitializer.statistic;
  }

  protected set dbOddInitializer(dbOddInitializer: DbOddInitializer) {
    this.wrappedDbOddInitializer = dbOddInitializer;
  }

  protected get dbOddInitializer(): DbOddInitializer {
    if (!this.wrappedDbOddInitializer) {
      throw new Error(`wrappedDbOddInitializer is undefined.`);
    }

    return this.wrappedDbOddInitializer;
  }

  public get odd(): Odd {
    return this.dbOddInitializer.odd;
  }

  protected set textContent(textContent: string | null) {
    this.wrappedTextContent = textContent;
  }

  protected get textContent(): string | null {
    if (this.wrappedTextContent === undefined) {
      throw new Error(`wrappedTextContent is undefined.`);
    }

    return this.wrappedTextContent;
  }

  protected set price(price: number | null) {
    this.wrappedPrice = price;
  }

  protected get price(): number | null {
    if (this.wrappedPrice === undefined) {
      throw new Error(`wrappedPrice is undefined.`);
    }

    return this.wrappedPrice;
  }

  protected set value(value: number | null) {
    this.wrappedValue = value;
  }

  protected get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error(`wrappedValue is undefined.`);
    }

    return this.wrappedValue;
  }
}