import { ElementHandle } from 'puppeteer';

import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';
import { DataParser } from './data-parser';
import { DbGame, DbOdd, DbStatistic } from './db-connections';
import { OddButton } from './odd-button';

export abstract class OddButtonParser {
  protected readonly exchange: Exchange;
  protected readonly league: League;
  private wrappedOddButton: OddButton;
  private wrappedDbGame: DbGame | undefined;
  private wrappedDbStatistic: DbStatistic | undefined;
  private wrappedDbOdd: DbOdd | undefined;
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
    this.dbGame = await this.initDbGame();
    this.dbStatistic = await this.initDbStatistic();
    this.dbOdd = await this.initDbOdd();
    this.priceParser = await this.initPriceParser();
    this.valueParser = await this.initValueParser();

    await this.updateOddData();

    return this;
  }

  protected abstract initOddButton(): Promise<OddButton>;

  protected abstract initDbGame(): Promise<DbGame>;

  protected abstract initDbStatistic(): Promise<DbStatistic>;

  protected abstract initDbOdd(): Promise<DbOdd>;

  protected abstract initPriceParser(): Promise<DataParser>;

  protected abstract initValueParser(): Promise<DataParser>;

  public abstract updateOddData(): Promise<OddButtonParser>;

  protected async updateDbOddFromDataParsers(): Promise<void> {
    const price = await this.priceParser.getValue();
    const value = await this.valueParser.getValue();

    await this.dbOdd.updateData({
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

  protected set dbGame(dbGameConnection: DbGame) {
    this.wrappedDbGame = dbGameConnection;
  }

  protected get dbGame(): DbGame {
    if (!this.wrappedDbGame) {
      throw new Error(`wrappedDbGameConnection is undefined.`);
    }

    return this.wrappedDbGame;
  }

  public get game(): Game {
    return this.dbGame.game;
  }

  protected set dbStatistic(dbStatisticConnection: DbStatistic) {
    this.wrappedDbStatistic = dbStatisticConnection;
  }

  protected get dbStatistic(): DbStatistic {
    if (!this.wrappedDbStatistic) {
      throw new Error(`wrappedDbStatisticConnection is undefined.`);
    }

    return this.wrappedDbStatistic;
  }

  public get statistic(): Statistic {
    return this.dbStatistic.statistic;
  }

  protected set dbOdd(dbOddConnection: DbOdd) {
    this.wrappedDbOdd = dbOddConnection;
  }

  protected get dbOdd(): DbOdd {
    if (!this.wrappedDbOdd) {
      throw new Error(`wrappedDbOddConnection is undefined.`);
    }

    return this.wrappedDbOdd;
  }

  public get odd(): Odd {
    return this.dbOdd.odd;
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