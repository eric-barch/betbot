import * as p from 'puppeteer';

import { prisma } from '@/db';
import { PageParserInitData } from '@/init-data';
import { PageParser } from '@/page-parsers/models/base-models/page-parser/page-parser';
import { JsonGamesParser } from './json-games-parser';
import { Game, Statistic } from '@prisma/client';
import { DbUtilityFunctions } from '@/db';
import { OddHandleSet } from './odd-handle-set';

export class DraftKingsGamesPageParser extends PageParser {
  private jsonGamesParser: JsonGamesParser;
  private oddHandleSet: OddHandleSet;

  constructor({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }) {
    super({ pageParserInitData });
    this.jsonGamesParser = new JsonGamesParser({ pageParser: this });
    this.oddHandleSet = new OddHandleSet({ pageParser: this });
  }

  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<DraftKingsGamesPageParser> {
    const pageParser = new DraftKingsGamesPageParser({ pageParserInitData });
    await pageParser.init();
    await pageParser.jsonGamesParser.ensureGamesInDb();
    await pageParser.oddHandleSet.init();
    return pageParser;
  }
}