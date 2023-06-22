import { Exchange, League } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import {
  FanDuelDbGameInitializer, FanDuelDbStatisticInitializer, FanDuelOddButton
} from '@/parsers/models/exchange-models/fan-duel';
import { DbOddInitializer } from '@/parsers/models/common-models';
import {
  OddButtonParser,
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/odd-button-parser';

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
    });

    fanDuelOddButtonParser.oddButton = await FanDuelOddButton.create({
      parentOddButtonParser: fanDuelOddButtonParser,
      button,
    });
    fanDuelOddButtonParser.dbGameInitializer = await FanDuelDbGameInitializer.create({
      parentOddButtonParser: fanDuelOddButtonParser,
    });
    fanDuelOddButtonParser.dbStatisticInitializer = await FanDuelDbStatisticInitializer.create({
      parentOddButtonParser: fanDuelOddButtonParser,
    });
    fanDuelOddButtonParser.dbOddInitializer = await DbOddInitializer.create({
      parentOddButtonParser: fanDuelOddButtonParser,
    });

    await fanDuelOddButtonParser.updateDbOddFromTextContent();

    return fanDuelOddButtonParser;
  }

  public async updateOdd(): Promise<FanDuelOddButtonParser> {
    await this.oddButtonWrapper.resetOddButtonFromReference();
    await this.updateDbOddFromOddButtonTextContent();
    return this;
  }
}