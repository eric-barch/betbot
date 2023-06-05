import * as p from 'puppeteer';

import { prisma } from '@/db';
import { PageParser } from '@/parsers/models/base-models';
import { OddHandleParser } from './odd-handle-parser';
import { Exchange, Game, League, Odd, Statistic } from '@prisma/client';


export class OddHandle {
  private parentPageParser: PageParser;
  private oddHandleParser: OddHandleParser;
  private wrappedButtonElement: p.ElementHandle;
  private wrappedPriceElement: p.ElementHandle | null | undefined;
  private wrappedPrice: number | null | undefined;
  private wrappedValueElement: p.ElementHandle | null | undefined;
  private wrappedValue: number | null | undefined;
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
    this.odd = await this.scrape();
    return this;
  }

  public async scrape(): Promise<Odd> {
    this.price = await this.parseElement({ element: this.priceElement });
    this.value = await this.parseElement({ element: this.valueElement });

    this.odd = await prisma.odd.update({
      where: {
        id: this.odd.id,
      },
      data: {
        price: this.price,
        value: this.value,
      }
    });

    return this.odd;
  }

  private async parseElement({
    element,
  }: {
    element: p.ElementHandle | null,
  }): Promise<number | null> {
    if (!element) {
      return null;
    }

    const elementString = await (await element.getProperty('textContent')).jsonValue();

    if (!elementString) {
      return null;
    }

    const allHyphens = '−-−‐‑‒–—―';

    const standardMinusSign = elementString.replace(new RegExp(`[${allHyphens}]`, 'g'), '-');

    const cleanString = standardMinusSign.replace(/[^0-9.-]/g, '');

    return Number(cleanString);
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

  private set price(price: number | null) {
    this.wrappedPrice = price;
  }

  public get price(): number | null {
    if (this.wrappedPrice === undefined) {
      throw new Error(`wrappedPrice is undefined.`);
    }

    return this.wrappedPrice;
  }

  private set priceElement(priceElement: p.ElementHandle | null) {
    this.wrappedPriceElement = priceElement;
  }

  private get priceElement(): p.ElementHandle | null {
    if (this.wrappedPriceElement === undefined) {
      throw new Error(`wrappedPriceElement is undefined.`);
    }

    return this.wrappedPriceElement;
  }

  public get statistic(): Statistic {
    return this.oddHandleParser.statistic;
  }

  private set value(value: number | null) {
    this.wrappedValue = value;
  }

  private get value(): number | null {
    if (this.wrappedValue === undefined) {
      throw new Error(`wrappedValue is undefined.`);
    }

    return this.wrappedValue;
  }

  private set valueElement(valueElement: p.ElementHandle | null) {
    this.wrappedValueElement = valueElement;
  }

  private get valueElement(): p.ElementHandle | null {
    if (this.wrappedValueElement === undefined) {
      throw new Error(`wrappedValueElement is undefined.`);
    }

    return this.wrappedValueElement;
  }
}