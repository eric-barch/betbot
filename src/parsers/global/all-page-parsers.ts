import { PageParser } from '@/parsers';
import { allPageParserInitData } from '@/setup';

import { DraftKingsParserFactory } from '../models/exchange-models/draft-kings/draft-kings-parser-factory';
import { FanDuelParserFactory } from '../models/exchange-models/fan-duel/fan-duel-parser-factory';
import { IParserFactory } from '../models/common-models/i-parser-factory';

class AllPageParsers {
  private set: Set<PageParser> = new Set<PageParser>();

  public async init(): Promise<AllPageParsers> {
    await allPageParserInitData.init();

    await Promise.all(
      Array.from(allPageParserInitData).map(async (initData) => {
        const exchangeName = initData.exchangeInitData.name;

        let parserFactory: IParserFactory;

        switch (exchangeName) {
          case 'DraftKings':
            parserFactory = new DraftKingsParserFactory();
            break;
          case 'FanDuel':
            parserFactory = new FanDuelParserFactory();
            break;
          default:
            throw new Error(`Exchange ${exchangeName} is not supported.`);
        }

        const pageParser = await PageParser.create({
          initData,
          parserFactory,
        });

        this.set.add(pageParser);
      })
    );

    return this;
  }

  public async updateOdds(): Promise<AllPageParsers> {
    const start = Date.now();

    await Promise.all(
      Array.from(this.set).map(async (pageParser) => {
        await pageParser.updateOdds();
      })
    );


    const end = Date.now();

    console.log(`Updated in ${end - start}ms`);
    return this;
  }

  public async disconnect(): Promise<AllPageParsers> {
    await Promise.all(
      Array.from(this.set).map(async (pageParser) => {
        await pageParser.disconnect();
      })
    );

    return this;
  }
}

export const allPageParsers = new AllPageParsers();