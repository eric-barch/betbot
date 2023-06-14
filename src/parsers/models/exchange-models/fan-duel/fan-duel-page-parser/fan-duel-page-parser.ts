import { FanDuelJsonGamesParser, FanDuelOddButtonParsers } from '@/parsers/models/exchange-models/fan-duel';
import { OddButtonParsers } from '@/parsers/models/shared-models';
import { PageParser } from '@/parsers/models/shared-models/page-parser/page-parser';
import { PageParserInitData } from '@/setup';

export class FanDuelPageParser extends PageParser {
  private wrappedJsonGamesParser: FanDuelJsonGamesParser | undefined;

  public static async create({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<FanDuelPageParser> {
    const fanDuelPageParser = new FanDuelPageParser({ initData });
    await fanDuelPageParser.init();
    return fanDuelPageParser;
  }

  protected async createOddButtonParsers(): Promise<OddButtonParsers> {
    this.jsonGamesParser = await FanDuelJsonGamesParser.create({ parentPageParser: this });
    this.oddButtonParsers = await FanDuelOddButtonParsers.create({ parentPageParser: this });
    return this.oddButtonParsers;
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