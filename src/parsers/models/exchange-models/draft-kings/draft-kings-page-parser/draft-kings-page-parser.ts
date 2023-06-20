import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import { DraftKingsJsonGamesParser, DraftKingsOddButtonParserSet } from '@/parsers/models/exchange-models/draft-kings';
import { IPageParser, PageParser } from '@/parsers/models/common-models/page-parser/page-parser';
import { PageParserInitData } from '@/setup';

export class DraftKingsPageParser implements IPageParser {
  private wrappedPageParser: PageParser | undefined;
  private wrappedJsonGamesParser: DraftKingsJsonGamesParser | undefined;
  private wrappedOddButtonParserSet: DraftKingsOddButtonParserSet | undefined;

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
    draftKingsPageParser.oddButtonParserSet = await DraftKingsOddButtonParserSet.create({
      parentPageParser: draftKingsPageParser,
    });

    return draftKingsPageParser;
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

  private set oddButtonParserSet(oddButtonParsers: DraftKingsOddButtonParserSet) {
    this.wrappedOddButtonParserSet = oddButtonParsers;
  }

  public get oddButtonParserSet(): DraftKingsOddButtonParserSet {
    if (!this.wrappedOddButtonParserSet) {
      throw new Error(`wrappedOddButtonParsers is undefined.`);
    }

    return this.wrappedOddButtonParserSet;
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