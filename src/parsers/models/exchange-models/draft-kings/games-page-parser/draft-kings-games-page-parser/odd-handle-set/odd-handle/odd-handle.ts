import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { Odd } from '@prisma/client';
import { OddHandleParser } from './odd-handle-parser';


export class OddHandle {
  private oddHandleParser: OddHandleParser;
  private wrappedOdd: Odd | undefined;

  private constructor({
    parentPageParser,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }) {
    this.oddHandleParser = new OddHandleParser({
      parentPageParser,
      buttonElement,
    });
  }

  public static async create({
    parentPageParser,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }): Promise<OddHandle> {
    const oddHandle = new OddHandle({
      parentPageParser,
      buttonElement,
    });
    oddHandle.odd = await oddHandle.oddHandleParser.init();
    return oddHandle;
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
}