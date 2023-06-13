import { DraftKingsJsonGamesParser, DraftKingsOddButtonParsers } from '@/parsers/models/exchange-models/draft-kings';
import { OddButtonParsers, PageParser } from '@/parsers/models/shared-models';
import { PageParserInitData } from '@/setup';

export class DraftKingsPageParser extends PageParser {
  private wrappedJsonGamesParser: DraftKingsJsonGamesParser | undefined;

  public static async create({
    initData,
  }: {
    initData: PageParserInitData,
  }): Promise<DraftKingsPageParser> {
    const draftKingsPageParser = new DraftKingsPageParser({ initData });
    await draftKingsPageParser.init();
    return draftKingsPageParser;
  }

  protected async createOddButtonParsers(): Promise<OddButtonParsers> {
    this.jsonGamesParser = await DraftKingsJsonGamesParser.create({ parentPageParser: this });
    this.oddButtonParsers = await DraftKingsOddButtonParsers.create({ parentPageParser: this });
    return this.oddButtonParsers;
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