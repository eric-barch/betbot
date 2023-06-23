import { Exchange, League } from '@prisma/client';
import { Page } from 'puppeteer';

import {
  OddButtonParserSet, ParserFactory, SpecializedJsonGamesParser, Webpage,
} from '@/parsers/models/common-models';

export class PageParser {
  public readonly exchange: Exchange;
  public readonly league: League;
  private readonly url: string;
  private readonly parserFactory: ParserFactory;
  private wrappedWebpage: Webpage | undefined;
  private wrappedJsonGamesParser: SpecializedJsonGamesParser | undefined;
  private wrappedOddButtonParserSet: OddButtonParserSet | undefined;

  private constructor({
    exchange,
    league,
    url,
    parserFactory,
  }: {
    exchange: Exchange,
    league: League,
    url: string,
    parserFactory: ParserFactory,
  }) {
    this.exchange = exchange;
    this.league = league;
    this.url = url;
    this.parserFactory = parserFactory;
  }

  public static async create({
    exchange,
    league,
    url,
    parserFactory,
  }: {
    exchange: Exchange,
    league: League,
    url: string,
    parserFactory: ParserFactory,
  }): Promise<PageParser> {
    const pageParser = new PageParser({
      url,
      exchange,
      league,
      parserFactory,
    });
    await pageParser.init();
    return pageParser;
  }

  private async init(): Promise<PageParser> {
    this.webpage = await Webpage.create({ url: this.url });
    this.jsonGamesParser = await this.parserFactory.createJsonGamesParser({ parentPageParser: this });
    this.oddButtonParserSet = await OddButtonParserSet.create({
      parentPageParser: this,
      parserFactory: this.parserFactory,
    });

    return this;
  }

  public async updateOdds(): Promise<void> {
    await this.oddButtonParserSet.updateOddsForEachButtonParser();
  }

  public async reloadPage(): Promise<void> {
    await this.webpage.reloadPage();
  }

  public async disconnect(): Promise<void> {
    await this.webpage.disconnect();
  }

  public get page(): Page {
    return this.webpage.page;
  }

  private set webpage(webpage: Webpage) {
    this.wrappedWebpage = webpage;
  }

  private get webpage(): Webpage {
    if (!this.wrappedWebpage) {
      throw new Error(`wrappedWebpage is undefined.`);
    }

    return this.wrappedWebpage;
  }

  private set jsonGamesParser(jsonGamesParser: SpecializedJsonGamesParser) {
    this.wrappedJsonGamesParser = jsonGamesParser;
  }

  private get jsonGamesParser(): SpecializedJsonGamesParser {
    if (!this.wrappedJsonGamesParser) {
      throw new Error(`wrappedJsonGamesParser is undefined.`);
    }

    return this.wrappedJsonGamesParser;
  }

  private set oddButtonParserSet(oddButtonParserSet: OddButtonParserSet) {
    this.wrappedOddButtonParserSet = oddButtonParserSet;
  }

  private get oddButtonParserSet(): OddButtonParserSet {
    if (!this.wrappedOddButtonParserSet) {
      throw new Error(`wrappedOddButtonParserSet is undefined.`);
    }

    return this.wrappedOddButtonParserSet;
  }
}