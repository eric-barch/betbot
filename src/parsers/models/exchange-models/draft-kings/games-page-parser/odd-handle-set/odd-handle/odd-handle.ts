import * as p from 'puppeteer';

import { PageParser } from '@/parsers/models/base-models';
import { OddHandleParser } from './odd-handle-parser';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';


export class OddHandle {
  private parentPageParser: PageParser;
  private oddHandleParser: OddHandleParser;
  private wrappedButtonElement: p.ElementHandle;
  private wrappedValueElement: p.ElementHandle | null | undefined;
  private wrappedPriceElement: p.ElementHandle | null | undefined;
  private wrappedOdd: Odd | undefined;

  constructor({
    parentPageParser,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }) {
    this.parentPageParser = parentPageParser;
    this.oddHandleParser = new OddHandleParser({ parentOddHandle: this });
    this.wrappedButtonElement = buttonElement;
  }

  public async init(): Promise<OddHandle> {
    this.valueElement = await this.oddHandleParser.parseValueElement();
    this.priceElement = await this.oddHandleParser.parsePriceElement();
    this.odd = await this.oddHandleParser.parseOdd();
    return this;
  }

  public get buttonElement(): p.ElementHandle {
    return this.wrappedButtonElement;
  }

  public get exchange(): Exchange {
    return this.parentPageParser.exchange;
  }

  public get exchangeAssignedGameId(): string {
    return this.oddHandleParser.exchangeAssignedGameId;
  }

  public get game(): Game {
    return this.oddHandleParser.game;
  }

  public get league(): League {
    return this.parentPageParser.league;
  }

  private set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }

  public get odd(): Odd {
    if (!this.wrappedOdd) {
      throw new Error(`wrappedOdd is undefined.`);
    }

    return this.wrappedOdd;
  }

  public get statistic(): Statistic {
    return this.oddHandleParser.statistic;
  }

  private set valueElement(valueElement: p.ElementHandle | null) {
    this.wrappedValueElement = valueElement;
  }

  private set priceElement(priceElement: p.ElementHandle | null) {
    this.wrappedPriceElement = priceElement;
  }
}