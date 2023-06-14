import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { OddButtonParser } from '@/parsers/models/shared-models/page-parser/odd-button-parsers/odd-button-parser/odd-button-parser';
import { DraftKingsDbGameInitializer, DraftKingsDbStatisticInitializer, DraftKingsOddButton } from '@/parsers/models/exchange-models/draft-kings';
import { DbOddInitializer } from '@/parsers/models/shared-models';

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
    this.oddButton = await DraftKingsOddButton.create({ parentOddButtonParser: this });
    this.dbGameInitializer = await DraftKingsDbGameInitializer.create({ parentOddButtonParser: this });
    this.dbStatisticInitializer = await DraftKingsDbStatisticInitializer.create({ parentOddButtonParser: this });
    this.dbOddInitializer = await DbOddInitializer.create({ parentOddButtonParser: this });
    await this.updateDbOddFromTextContent();
    return this;
  }

  public async updateOddData(): Promise<DraftKingsOddButtonParser> {
    await this.oddButton.updateOddButton();
    await this.updateDbOddFromTextContent();
    return this;
  }
}