import * as c from 'chrono-node';
import * as p from 'puppeteer';

import { Exchange, Game, Odd, Statistic } from '@prisma/client';
import { prisma, DbUtilityFunctions } from '@/db';
import { OddHandleInitializer } from './odd-handle-initializer';
import { OddHandleSet } from '../odd-handle-set';


export class OddHandle {
  private parent: OddHandleSet;
  private initializer: OddHandleInitializer;
  private wrappedButtonElement: p.ElementHandle;
  private wrappedValueElement: p.ElementHandle | null | undefined;
  private wrappedPriceElement: p.ElementHandle | null | undefined;
  private wrappedOdd: Odd | undefined;

  constructor({
    parent,
    buttonElement,
  }: {
    parent: OddHandleSet,
    buttonElement: p.ElementHandle,
  }) {
    this.parent = parent;
    this.initializer = new OddHandleInitializer({
      parent: this,
    });
    this.wrappedButtonElement = buttonElement;
  }

  public async init(): Promise<OddHandle> {
    this.valueElement = await this.initializer.initValueElement();
    this.priceElement = await this.initializer.initPriceElement();
    this.odd = await this.initializer.initOdd();

    return this;
  }

  public get exchange(): Exchange {
    return this.parent.exchange;
  }

  public get buttonElement(): p.ElementHandle {
    return this.wrappedButtonElement;
  }

  private set valueElement(valueElement: p.ElementHandle | null) {
    this.wrappedValueElement = valueElement;
  }

  private set priceElement(priceElement: p.ElementHandle | null) {
    this.wrappedPriceElement = priceElement;
  }

  private set odd(odd: Odd) {
    this.wrappedOdd = odd;
  }
}