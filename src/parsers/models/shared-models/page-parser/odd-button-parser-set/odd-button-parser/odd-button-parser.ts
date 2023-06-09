import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { DbGameConnection, DbStatisticConnection, DbOddConnection } from './db-connections';
import { DataParser } from './data-parser';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';

export abstract class OddButtonParser {
  private parentPageParser: PageParser;
  private wrappedButtonElement: p.ElementHandle;
  private wrappedDbGameConnection: DbGameConnection | undefined;
  private wrappedDbStatisticConnection: DbStatisticConnection | undefined;
  private wrappedDbOddConnection: DbOddConnection | undefined;
  private wrappedPriceParser: DataParser | undefined;
  private wrappedValueParser: DataParser | undefined;

  protected constructor({
    parentPageParser,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }) {
    this.parentPageParser = parentPageParser;
    this.wrappedButtonElement = buttonElement;
  }

  protected async init(): Promise<OddButtonParser> {
    this.dbGameConnection = await this.initDbGameConnection();
    this.dbStatisticConnection = await this.initDbStatisticConnection();
    this.dbOddConnection = await this.initDbOddConnection();
    this.priceParser = await this.initPriceParser();
    this.valueParser = await this.initValueParser();
    return this;
  }

  protected abstract initDbGameConnection(): Promise<DbGameConnection>;

  protected abstract initDbStatisticConnection(): Promise<DbStatisticConnection>;

  protected abstract initDbOddConnection(): Promise<DbOddConnection>;

  protected abstract initPriceParser(): Promise<DataParser>;

  protected abstract initValueParser(): Promise<DataParser>;

  public get exchange(): Exchange {
    return this.parentPageParser.exchange;
  }

  public get league(): League {
    return this.parentPageParser.league;
  }

  public get buttonElement(): p.ElementHandle {
    return this.wrappedButtonElement;
  }

  protected set dbGameConnection(dbGameConnection: DbGameConnection) {
    this.wrappedDbGameConnection = dbGameConnection;
  }

  protected get dbGameConnection(): DbGameConnection {
    if (!this.wrappedDbGameConnection) {
      throw new Error(`wrappedDbGameConnection is undefined.`);
    }

    return this.wrappedDbGameConnection;
  }

  public get game(): Game {
    return this.dbGameConnection.game;
  }

  protected set dbStatisticConnection(dbStatisticConnection: DbStatisticConnection) {
    this.wrappedDbStatisticConnection = dbStatisticConnection;
  }

  protected get dbStatisticConnection(): DbStatisticConnection {
    if (!this.wrappedDbStatisticConnection) {
      throw new Error(`wrappedDbStatisticConnection is undefined.`);
    }

    return this.wrappedDbStatisticConnection;
  }

  public get statistic(): Statistic {
    return this.dbStatisticConnection.statistic;
  }

  protected set dbOddConnection(dbOddConnection: DbOddConnection) {
    this.wrappedDbOddConnection = dbOddConnection;
  }

  protected get dbOddConnection(): DbOddConnection {
    if (!this.wrappedDbOddConnection) {
      throw new Error(`wrappedDbOddConnection is undefined.`);
    }

    return this.wrappedDbOddConnection;
  }

  public get odd(): Odd {
    return this.dbOddConnection.odd;
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

  public get price(): number | null {
    return this.priceParser.value;
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

  public get value(): number | null {
    return this.valueParser.value;
  }
}