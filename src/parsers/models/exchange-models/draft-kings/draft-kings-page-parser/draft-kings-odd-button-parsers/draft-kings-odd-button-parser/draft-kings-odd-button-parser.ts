import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import {
  DraftKingsDbGameInitializer, DraftKingsDbOddInitializer, DraftKingsDbStatisticInitializer,
} from '@/parsers/models/exchange-models/draft-kings';
import {
  DataParser, DbGameInitializer, DbOddInitializer, DbStatisticInitializer,
  OddButton, OddButtonParser,
} from '@/parsers/models/shared-models';

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

  protected async initOddButton(): Promise<OddButton> {
    await this.oddButton.init({ referenceSelector: 'tr' });
    const foo = this.oddButton;
    return this.oddButton;
  }

  protected async createConcreteDbGameInitializer(): Promise<DbGameInitializer> {
    this.dbGameInitializer = await DraftKingsDbGameInitializer.create({ parentOddButtonParser: this });
    return this.dbGameInitializer;
  }

  protected async createConcreteDbStatisticInitializer(): Promise<DbStatisticInitializer> {
    this.dbStatisticInitializer = await DraftKingsDbStatisticInitializer.create({ parentOddButtonParser: this });
    return this.dbStatisticInitializer;
  }

  protected async createConcreteDbOddInitializer(): Promise<DbOddInitializer> {
    this.dbOddInitializer = await DraftKingsDbOddInitializer.create({ parentOddButtonParser: this });
    return this.dbOddInitializer;
  }

  protected async createConcretePriceParser(): Promise<DataParser> {
    this.priceParser = await DataParser.create({
      parentOddButtonParser: this,
      selector: '.sportsbook-outcome-cell__elements',
    });

    return this.priceParser;
  }

  protected async createConcreteValueParser(): Promise<DataParser> {
    this.valueParser = await DataParser.create({
      parentOddButtonParser: this,
      selector: '.sportsbook-outcome-cell__label-line-container',
    });

    return this.valueParser;
  }

  public async updateOddData(): Promise<DraftKingsOddButtonParser> {
    await this.oddButton.updateOddButton();
    await this.createConcretePriceParser();
    await this.createConcreteValueParser();
    await this.updateDbOddFromDataParsers();
    return this;
  }
}