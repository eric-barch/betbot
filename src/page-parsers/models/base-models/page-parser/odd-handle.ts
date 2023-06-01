import { Odd } from '@prisma/client';
import * as p from 'puppeteer';

export class OddHandle {
  private wrappedDbOdd: Odd | undefined;
  private wrappedValueHandle: p.ElementHandle | null | undefined;
  private wrappedPriceHandle: p.ElementHandle | undefined;

  private get dbOdd(): Odd {
    if (!this.wrappedDbOdd) {
      throw new Error(`wrappedDbOdd is undefined.`);
    }

    return this.wrappedDbOdd;
  }

  private get valueHandle(): p.ElementHandle | null {
    if (this.wrappedValueHandle === undefined) {
      throw new Error(`wrappedValueHandle is undefined.`);
    }

    return this.wrappedValueHandle;
  }

  private get priceHandle(): p.ElementHandle {
    if (!this.wrappedPriceHandle) {
      throw new Error(`wrappedPriceHandle is undefined.`);
    }

    return this.wrappedPriceHandle;
  }
}