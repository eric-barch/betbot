import { ElementHandle } from 'puppeteer';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';

import { DataParser } from './data-parser';
import { DbGameInitializer, DbOddInitializer, DbStatisticInitializer } from './db-initializers';
import { OddButton } from './odd-button';

export abstract class OddButtonParser {
  public readonly exchange: Exchange;
  public readonly league: League;
  // TODO: This is hacky.
  public readonly seedButton: ElementHandle;
  private wrappedOddButton: OddButton | undefined;
  private wrappedDbGameInitializer: DbGameInitializer | undefined;
  private wrappedDbStatisticInitializer: DbStatisticInitializer | undefined;
  private wrappedDbOddInitializer: DbOddInitializer | undefined;
  private wrappedPriceParser: DataParser | undefined;
  private wrappedValueParser: DataParser | undefined;

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

  public abstract updateOddData(): Promise<OddButtonParser>;

  protected async updateDbOddFromDataParsers(): Promise<void> {
    const price = await this.priceParser.getValue();
    const value = await this.valueParser.getValue();

    await this.dbOddInitializer.updateData({
      price,
      value,
    });
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

  protected set priceParser(priceParser: DataParser) {
    this.wrappedPriceParser = priceParser;
  }

  protected get priceParser(): DataParser {
    if (!this.wrappedPriceParser) {
      throw new Error(`wrappedPriceParser is undefined.`);
    }

    return this.wrappedPriceParser;
  }

  protected set valueParser(valueParser: DataParser) {
    this.wrappedValueParser = valueParser;
  }

  protected get valueParser(): DataParser {
    if (!this.wrappedValueParser) {
      throw new Error(`wrappedValueParser is undefined.`);
    }

    return this.wrappedValueParser;
  }
}