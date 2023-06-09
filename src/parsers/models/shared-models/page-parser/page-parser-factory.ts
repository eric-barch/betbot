import { PageParserInitData } from '@/config';
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

        break;
      case 'SugarHouse':

        break;
    }

    throw new Error(`Did not find matching exchangeName.`);
  }
}