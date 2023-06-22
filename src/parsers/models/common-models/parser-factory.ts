import { ElementHandle } from 'puppeteer';

import { DbGameInitializer, DbStatisticInitializer, OddButtonWrapper, SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet } from './page-parser';

export interface ParserFactory {
  createJsonGamesParser(): Promise<SpecializedJsonGamesParser>;

  createOddButtonParserSet(): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    button,
  }: {
    button: ElementHandle,
  }): Promise<SpecializedOddButtonParser>;

  createOddButton(): Promise<OddButtonWrapper>;

  createDbGameInitializer(): Promise<DbGameInitializer>;

  createDbStatisticInitializer(): Promise<DbStatisticInitializer>;
}