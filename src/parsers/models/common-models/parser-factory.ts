import { ElementHandle } from 'puppeteer';

import { SpecializedJsonGamesParser, SpecializedOddButtonParserSet, PageParser, SpecializedOddButtonParser, OddButton } from './page-parser';

export interface ParserFactory {
  createJsonGamesParser(): Promise<SpecializedJsonGamesParser>;

  createOddButtonParserSet(): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    button,
  }: {
    button: ElementHandle,
  }): Promise<SpecializedOddButtonParser>;

  createOddButton(): Promise<OddButton>;

  createDbGameInitializer(): Promise<DbGameInitializer>;

  createDbStatisticInitializer(): Promise<DbStatisticInitializer>;
}