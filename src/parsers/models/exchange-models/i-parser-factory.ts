import { PageParserInitData } from '@/setup';

import { IOddButtonParserSet, IPageParser } from '../common-models';

export interface IParserFactory {
  createPageParser({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<IPageParser>;

  createOddButtonParserSet({
    parentPageParser,
  }: {
    parentPageParser: IPageParser,
  }): Promise<IOddButtonParserSet>;
}