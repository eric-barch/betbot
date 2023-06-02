import * as p from 'puppeteer';

import { Odd } from '@prisma/client';

export class OddHandle {
  private wrappedButtonElement: p.ElementHandle;
  private wrappedValueElement: p.ElementHandle | null;
  private wrappedPriceElement: p.ElementHandle;

  constructor({
    buttonElement,
    valueElement,
    priceElement,
  }: {
    buttonElement: p.ElementHandle,
    valueElement: p.ElementHandle | null,
    priceElement: p.ElementHandle,
  }) {
    this.wrappedButtonElement = buttonElement;
    this.wrappedValueElement = valueElement;
    this.wrappedPriceElement = priceElement;
  }
}