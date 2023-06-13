import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/odd-button-parser';
import { FanDuelOddButton, FanDuelDbGameInitializer } from '@/parsers/models/exchange-models/fan-duel';

export class FanDuelOddButtonParser extends OddButtonParser {
  public static async create({
    exchange,
    league,
    button,
  }: {
    exchange: Exchange,
    league: League,
    button: ElementHandle,
  }): Promise<FanDuelOddButtonParser> {
    const fanDuelOddButtonParser = new FanDuelOddButtonParser({
      exchange,
      league,
      button,
    });
    await fanDuelOddButtonParser.init();
    return fanDuelOddButtonParser;
  }

  protected async init(): Promise<FanDuelOddButtonParser> {
    this.oddButton = await FanDuelOddButton.create({ parentOddButtonParser: this });
    this.dbGameInitializer = await FanDuelDbGameInitializer.create({ parentOddButtonParser: this });
    this.dbStatisticInitializer = await FanDuelDbStatisticInitializer.create({ parentOddButtonParser: this });
    // this.dbOddInitializer = await FanDuelDbOddInitializer.create({ parentOddButtonParser: this });
    // this.priceParser = await FanDuelPriceParser.create({ parentOddButtonParser: this });
    // this.valueParser = await FanDuelValueParser.create({ parentOddButtonParser: this });
    return this;
  }

  public async updateOddData(): Promise<FanDuelOddButtonParser> {
    throw new Error(`updateOddData not implemented.`);
  }
}