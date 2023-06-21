import { IJsonGamesParser, IOddButtonParserSet, PageParser } from '../../common-models';
import { IParserFactory } from '../../common-models/i-parser-factory';

import { DraftKingsJsonGamesParser, DraftKingsOddButtonParserSet } from './draft-kings-page-parser';

export class DraftKingsParserFactory implements IParserFactory {
  public async createJsonGamesParser({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<IJsonGamesParser> {
    return await DraftKingsJsonGamesParser.create({ parentPageParser });
  }

  public async createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: PageParser,
  }): Promise<IOddButtonParserSet> {
    return await DraftKingsOddButtonParserSet.create({ parentPageParser });
  }
}