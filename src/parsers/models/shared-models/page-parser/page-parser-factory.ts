import { PageParserInitData } from '@/setup';
import { PageParser, DraftKingsPageParser } from '@/parsers';

export class PageParserFactory {
  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<PageParser> {
    const exchangeName = pageParserInitData.exchangeInitData.name;

    switch (exchangeName) {
      case 'DraftKings':
        return await DraftKingsPageParser.create({ pageParserInitData });
      case 'FanDuel':
        throw new Error(`FanDuelPageParser not implemented.`);
      case 'SugarHouse':
        throw new Error(`SugarHousePageParser not implemented.`);
    }

    throw new Error(`Did not find matching exchangeName.`);
  }
}