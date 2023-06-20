import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { FanDuelJsonGamesParser, FanDuelOddButtonParserSet } from '@/parsers/models/exchange-models/fan-duel';
import { IPageParser, PageParser } from '@/parsers/models/common-models/page-parser/page-parser';
import { PageParserInitData } from '@/setup';

export class FanDuelPageParser implements IPageParser {
  private wrappedPageParser: PageParser | undefined;
  private wrappedJsonGamesParser: FanDuelJsonGamesParser | undefined;
  private wrappedOddButtonParsers: FanDuelOddButtonParserSet | undefined;

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
    fanDuelPageParser.oddButtonParserSet = await FanDuelOddButtonParserSet.create({
      parentPageParser: fanDuelPageParser,
    });

    return fanDuelPageParser;
  }

  public async updateOdds(): Promise<void> {
    await this.oddButtonParserSet.updateOdds();
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

  private set oddButtonParserSet(oddButtonParsers: FanDuelOddButtonParserSet) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  public get oddButtonParserSet(): FanDuelOddButtonParserSet {
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