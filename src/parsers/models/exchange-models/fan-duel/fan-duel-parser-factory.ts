import { PageParserInitData } from '@/setup';

import { IOddButtonParserSet, IPageParser } from '../../common-models';
import { IParserFactory } from '../i-parser-factory';

import { FanDuelOddButtonParserSet, FanDuelPageParser } from './fan-duel-page-parser';

export class FanDuelParserFactory implements IParserFactory {
  public async createPageParser({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<IPageParser> {
    return await FanDuelPageParser.create({ initData });
  }

  public async createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: IPageParser,
  }): Promise<IOddButtonParserSet> {
    return await FanDuelOddButtonParserSet.create({ parentPageParser });
  }
}