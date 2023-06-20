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
    });

    draftKingsOddButtonParser.oddButton = await DraftKingsOddButton.create({
      parentOddButtonParser: draftKingsOddButtonParser,
      button,
    });
    draftKingsOddButtonParser.dbGameInitializer = await DraftKingsDbGameInitializer.create({
      parentOddButtonParser: draftKingsOddButtonParser,
    });
    draftKingsOddButtonParser.dbStatisticInitializer = await DraftKingsDbStatisticInitializer.create({
      parentOddButtonParser: draftKingsOddButtonParser,
    });
    draftKingsOddButtonParser.dbOddInitializer = await DbOddInitializer.create({
      parentOddButtonParser: draftKingsOddButtonParser,
    });

    await draftKingsOddButtonParser.updateDbOddFromTextContent();

    return draftKingsOddButtonParser;
  }

  public async updateOdd(): Promise<DraftKingsOddButtonParser> {
    await this.oddButton.resetFromReference();
    await this.updateDbOddFromTextContent();
    return this;
  }
}