import { OddButtonParser, OddButtonParserSet, OddButtonWrapper, PageParser, SpecializedJsonGamesParser, SpecializedOddButtonParser, SpecializedOddButtonParserSet, SpecializedOddButtonWrapper } from '../../common-models';
import { ParserFactory } from '../../common-models/parser-factory';

import { DraftKingsJsonGamesParser, DraftKingsOddButtonParser, DraftKingsOddButtonParserSet, DraftKingsOddButtonWrapper } from './page-parser';

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
    parentOddButtonParserSet,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParserSet: OddButtonParserSet,
  }): Promise<SpecializedOddButtonParserSet> {
    return new DraftKingsOddButtonParserSet({
      parentPageParser,
      parentOddButtonParserSet,
    });
  }

  public async createOddButtonParser({
    parentPageParser,
    parentOddButtonParser,
  }: {
    parentPageParser: PageParser,
    parentOddButtonParser: OddButtonParser,
  }): Promise<SpecializedOddButtonParser> {
    return new DraftKingsOddButtonParser({
      parentPageParser,
      parentOddButtonParser,
    });
  }

  public async createOddButtonWrapper({
    parentOddButtonParser,
    parentOddButtonWrapper,
  }: {
    parentOddButtonParser: OddButtonParser,
    parentOddButtonWrapper: OddButtonWrapper,
  }): Promise<SpecializedOddButtonWrapper> {
    return new DraftKingsOddButtonWrapper({
      parentOddButtonParser,
      parentOddButtonWrapper,
    });
  }
}