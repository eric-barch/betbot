import { ElementHandle } from 'puppeteer';

import { SpecializedJsonGamesParser, SpecializedOddButtonParserSet, PageParser, SpecializedOddButtonParser } from '../../common-models';
import { ParserFactory } from '../../common-models/parser-factory';

import { DraftKingsJsonGamesParser, DraftKingsOddButtonParser, DraftKingsOddButtonParserSet } from './page-parser';

export class DraftKingsParserFactory implements ParserFactory {
  public async createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser> {
    return await DraftKingsJsonGamesParser.create({ parentPageParser });
  }

  public async createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedOddButtonParserSet> {
    return await DraftKingsOddButtonParserSet.create({ parentPageParser });
  }

  public async createOddButtonParser({
    parentPageParser,
    button,
  }: {
    parentPageParser: PageParser,
    button: ElementHandle,
  }): Promise<SpecializedOddButtonParser> {
    return await DraftKingsOddButtonParser.create({
      parentPageParser,
      button,
    });
  }
}