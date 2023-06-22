import { ElementHandle } from 'puppeteer';

import { PageParser, SpecializedDbGameInitializer, SpecializedDbStatisticInitializer, SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper } from './page-parser';

export interface ParserFactory {
  createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<SpecializedJsonGamesParser>;

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