import { ElementHandle } from 'puppeteer';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';

import { DataParser } from './data-parser';
import { DbGameInitializer, DbOddInitializer, DbStatisticInitializer } from './db-initializers';
import { OddButton } from './odd-button';

export abstract class OddButtonParser {
  public readonly exchange: Exchange;
  public readonly league: League;
  private wrappedOddButton: OddButton;
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
    this.wrappedOddButton = new OddButton({ button });
  }

  protected async init(): Promise<OddButtonParser> {
    this.oddButton = await this.initOddButton();
    this.dbGameInitializer = await this.createConcreteDbGameInitializer();
    this.dbStatisticInitializer = await this.createConcreteDbStatisticInitializer();
    this.dbOddInitializer = await this.createConcreteDbOddInitializer();
    this.priceParser = await this.createConcretePriceParser();
    this.valueParser = await this.createConcreteValueParser();

    await this.updateOddData();

    return this;
  }

  protected abstract initOddButton(): Promise<OddButton>;

  protected abstract createConcreteDbGameInitializer(): Promise<DbGameInitializer>;

  protected abstract createConcreteDbStatisticInitializer(): Promise<DbStatisticInitializer>;

  protected abstract createConcreteDbOddInitializer(): Promise<DbOddInitializer>;

  protected abstract createConcretePriceParser(): Promise<DataParser>;

  protected abstract createConcreteValueParser(): Promise<DataParser>;

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