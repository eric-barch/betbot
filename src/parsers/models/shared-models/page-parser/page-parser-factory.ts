import { DraftKingsPageParser, FanDuelPageParser } from '@/parsers/models/exchange-models';
import { PageParserInitData } from '@/setup';

import { PageParser } from './page-parser';


export class PageParserFactory {
  public static async create({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<PageParser> {
    const exchangeName = initData.exchangeInitData.name;

    switch (exchangeName) {
      case 'DraftKings':
        return await DraftKingsPageParser.create({ initData });
      case 'FanDuel':
        return await FanDuelPageParser.create({ initData });
      case 'SugarHouse':
        throw new Error(`SugarHousePageParser not implemented.`);
    }

    throw new Error(`Did not find matching exchangeName.`);
  }
}