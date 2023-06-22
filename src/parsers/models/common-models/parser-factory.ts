import { ElementHandle } from 'puppeteer';

import { OddButtonParserSet, PageParser, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer, SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper } from './page-parser';

export interface ParserFactory {
  createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser>;

  createOddButtonParserSet({
    parentPageParser,
    parentOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    button,
  }: {
    button: ElementHandle,
  }): Promise<SpecializedOddButtonParser>;

  createOddButtonWrapper(): Promise<SpecializedOddButtonWrapper>;

  createDbGameInitializer(): Promise<SpecializedDbGameInitializer>;

  createDbStatisticInitializer(): Promise<SpecializedDbStatisticInitializer>;
}