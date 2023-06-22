import { ElementHandle } from 'puppeteer';

import { SpecializedDbGameInitializer, SpecializedDbStatisticInitializer, SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper } from './page-parser';

export interface ParserFactory {
  createJsonGamesParser(): Promise<SpecializedJsonGamesParser>;

  createOddButtonParserSet(): Promise<SpecializedOddButtonParserSet>;

  createOddButtonParser({
    button,
  }: {
    button: ElementHandle,
  }): Promise<SpecializedOddButtonParser>;

  createOddButtonWrapper(): Promise<SpecializedOddButtonWrapper>;

  createDbGameInitializer(): Promise<SpecializedDbGameInitializer>;

  createDbStatisticInitializer(): Promise<SpecializedDbStatisticInitializer>;
}