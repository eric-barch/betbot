import { PageParserInitData } from '@/setup';

import { IOddButtonParserSet, IPageParser } from '../../common-models';
import { IParserFactory } from '../i-parser-factory';

import { DraftKingsOddButtonParserSet, DraftKingsPageParser } from './draft-kings-page-parser';

export class DraftKingsParserFactory implements IParserFactory {
  public async createPageParser({
    parserFactory,
    initData,
  }: {
    parserFactory: IParserFactory,
    initData: PageParserInitData,
  }): Promise<IPageParser> {
    return await DraftKingsPageParser.create({ initData });
  }

  public async createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: IPageParser,
  }): Promise<IOddButtonParserSet> {
    return await DraftKingsOddButtonParserSet.create({ parentPageParser });
  }
}