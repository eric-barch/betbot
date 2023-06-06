import * as p from 'puppeteer';

import { PageParser } from '@/parsers';
import { Odd } from '@prisma/client';
import { OddHandleParser } from './odd-handle-parser';
import { OddHandleSet } from '../odd-handle-set';


export class OddHandle {
  private oddHandleParser: OddHandleParser;
  private wrappedOdd: Odd | undefined;

  private constructor({
    parentPageParser,
    parentOddHandleSet,
    buttonElement,
  }: {
    parentPageParser: PageParser,
    parentOddHandleSet: OddHandleSet
    buttonElement: p.ElementHandle,
  }) {
    this.oddHandleParser = new OddHandleParser({
      parentPageParser,
      parentOddHandleSet,
      buttonElement,
    });
  }

  public static async create({
    parentOddHandleSet,
    parentPageParser,
    buttonElement,
  }: {
    parentOddHandleSet: OddHandleSet,
    parentPageParser: PageParser,
    buttonElement: p.ElementHandle,
  }): Promise<OddHandle> {
    const oddHandle = new OddHandle({
      parentOddHandleSet,
      parentPageParser,
      buttonElement,
    });
    await oddHandle.oddHandleParser.init();
    oddHandle.odd = oddHandle.oddHandleParser.odd;
    return oddHandle;
  }

  public async update(): Promise<OddHandle> {
    await this.oddHandleParser.update();
    this.odd = this.oddHandleParser.odd;
    return this;
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