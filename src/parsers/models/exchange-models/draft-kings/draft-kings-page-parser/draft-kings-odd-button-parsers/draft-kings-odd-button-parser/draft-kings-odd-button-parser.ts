import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/odd-button-parser';

export class DraftKingsOddButtonParser extends OddButtonParser {
  public static async create({
    exchange,
    league,
    button,
  }: {
    exchange: Exchange,
    league: League,
    button: ElementHandle,
  }): Promise<DraftKingsOddButtonParser> {
    const draftKingsOddButtonParser = new DraftKingsOddButtonParser({
      exchange,
      league,
      button,
    });
    await draftKingsOddButtonParser.init();
    return draftKingsOddButtonParser;
  }

  protected async init(): Promise<DraftKingsOddButtonParser> {
    throw new Error(`init() not implemented.`);
  }

  public async updateOddData(): Promise<DraftKingsOddButtonParser> {
    throw new Error(`updateOddData() not implemented.`);
  }
}