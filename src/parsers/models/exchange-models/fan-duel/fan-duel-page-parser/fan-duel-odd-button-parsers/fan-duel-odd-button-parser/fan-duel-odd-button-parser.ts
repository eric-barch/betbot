import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { FanDuelDbGameInitializer } from '@/parsers/models/exchange-models/fan-duel';
import {
  DataParser, DbGameInitializer, DbOddInitializer, DbStatisticInitializer, OddButton, OddButtonParser
} from '@/parsers/models/shared-models';

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

  protected async initOddButton(): Promise<OddButton> {
    await this.oddButton.init({ referenceSelector: 'li' });
    return this.oddButton;
  }

  protected async createConcreteDbGameInitializer(): Promise<DbGameInitializer> {
    this.dbGameInitializer = await FanDuelDbGameInitializer.create({ parentOddButtonParser: this });
    return this.dbGameInitializer;
  }

  protected async createConcreteDbStatisticInitializer(): Promise<DbStatisticInitializer> {
    throw new Error(`createConcreteDbStatisticInitializer not implemented.`);
  }

  protected async createConcreteDbOddInitializer(): Promise<DbOddInitializer> {
    throw new Error(`createConcreteDbOddInitializer not implemented.`);
  }

  protected async createConcretePriceParser(): Promise<DataParser> {
    throw new Error(`createConcretePriceParser not implemented.`);
  }

  protected async createConcreteValueParser(): Promise<DataParser> {
    throw new Error(`createConcreteValueParser not implemented.`);
  }

  public async updateOddData(): Promise<FanDuelOddButtonParser> {
    await this.updateDbOddFromDataParsers();
    return this;
  }
}