import { IJsonGamesParser, IOddButtonParserSet, PageParser } from './page-parser';

export interface IParserFactory {
  createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<IJsonGamesParser>;

  createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<IOddButtonParserSet>;
}