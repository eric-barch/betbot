import { ElementHandle } from 'puppeteer';

import { DbGameInitializer, DbStatisticInitializer, SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper } from './page-parser';

export interface ParserFactory {
  createJsonGamesParser(): Promise<SpecializedJsonGamesParser>;

  createOddButtonParserSet(): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    button,
  }: {
    button: ElementHandle,
  }): Promise<SpecializedOddButtonParser>;

  createOddButtonWrapper(): Promise<SpecializedOddButtonWrapper>;

  createDbGameInitializer(): Promise<DbGameInitializer>;

  createDbStatisticInitializer(): Promise<DbStatisticInitializer>;
}