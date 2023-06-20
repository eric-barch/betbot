import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { DraftKingsJsonGamesParser, DraftKingsOddButtonParsers } from '@/parsers/models/exchange-models/draft-kings';
import { OddButtonParsers } from '@/parsers/models/shared-models';
import { IExchangePageParser, PageParser } from '@/parsers/models/shared-models/page-parser/page-parser';
import { PageParserInitData } from '@/setup';

export class DraftKingsPageParser implements IExchangePageParser {
  private wrappedPageParser: PageParser | undefined;
  private wrappedJsonGamesParser: DraftKingsJsonGamesParser | undefined;
  private wrappedOddButtonParsers: DraftKingsOddButtonParsers | undefined;

  public static async create({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<DraftKingsPageParser> {
    const draftKingsPageParser = new DraftKingsPageParser();

    draftKingsPageParser.pageParser = await PageParser.create({
      initData,
    });
    draftKingsPageParser.jsonGamesParser = await DraftKingsJsonGamesParser.create({
      parentPageParser: draftKingsPageParser,
    });
    draftKingsPageParser.oddButtonParsers = await DraftKingsOddButtonParsers.create({
      parentPageParser: draftKingsPageParser,
    });

    return draftKingsPageParser;
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

  private set oddButtonParsers(oddButtonParsers: DraftKingsOddButtonParsers) {
    this.wrappedOddButtonParsers = oddButtonParsers;
  }

  public get oddButtonParsers(): DraftKingsOddButtonParsers {
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

  private set jsonGamesParser(jsonGamesParser: DraftKingsJsonGamesParser) {
    this.wrappedJsonGamesParser = jsonGamesParser;
  }

  private get jsonGamesParser(): DraftKingsJsonGamesParser {
    if (!this.wrappedJsonGamesParser) {
      throw new Error(`wrappedJsonGamesParser is undefined.`);
    }

    return this.wrappedJsonGamesParser;
  }
}