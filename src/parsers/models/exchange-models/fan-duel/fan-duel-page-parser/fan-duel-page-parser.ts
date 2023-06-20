import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { FanDuelJsonGamesParser, FanDuelOddButtonParsers } from '@/parsers/models/exchange-models/fan-duel';
import { OddButtonParsers } from '@/parsers/models/shared-models';
import { IExchangePageParser, PageParser } from '@/parsers/models/shared-models/page-parser/page-parser';
import { PageParserInitData } from '@/setup';

export class FanDuelPageParser implements IExchangePageParser {
  private wrappedPageParser: PageParser | undefined;
  private wrappedJsonGamesParser: FanDuelJsonGamesParser | undefined;
  private wrappedOddButtonParsers: FanDuelOddButtonParsers | undefined;

  public static async create({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<FanDuelPageParser> {
    const fanDuelPageParser = new FanDuelPageParser();

    fanDuelPageParser.pageParser = await PageParser.create({
      initData,
    });
    fanDuelPageParser.jsonGamesParser = await FanDuelJsonGamesParser.create({
      parentPageParser: fanDuelPageParser,
    });
    fanDuelPageParser.oddButtonParsers = await FanDuelOddButtonParsers.create({
      parentPageParser: fanDuelPageParser,
    });

    return fanDuelPageParser;
  }

  public async updateOdds(): Promise<void> {
    await this.oddButtonParsers.updateOdds();
  }

  public async disconnect(): Promise<void> {
    await this.pageParser.disconnect();
  }

  public get page(): Page {
    return this.pageParser.page;
  }

  public get exchange(): Exchange {
    return this.pageParser.exchange;
  }

  public get league(): League {
    return this.pageParser.league;
  }

  private set oddButtonParsers(oddButtonParsers: FanDuelOddButtonParsers) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  public get oddButtonParsers(): FanDuelOddButtonParsers {
    if (!this.wrappedOddButtonParsers) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParsers;
  }

  private set pageParser(pageParser: PageParser) {
    this.wrappedPageParser = pageParser;
  }

  private get pageParser(): PageParser {
    if (!this.wrappedPageParser) {
      throw new Error(`wrappedPageParser is undefined.`);
    }

    return this.wrappedPageParser;
  }

  private set jsonGamesParser(jsonGamesParser: FanDuelJsonGamesParser) {
    this.wrappedJsonGamesParser = jsonGamesParser;
  }

  private get jsonGamesParser(): FanDuelJsonGamesParser {
    if (!this.wrappedJsonGamesParser) {
      throw new Error(`wrappedJsonGamesParser is undefined.`);
    }

    return this.wrappedJsonGamesParser;
  }
}