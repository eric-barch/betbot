import { PageParserInitData } from '@/setup';
import { PageParser } from '@/parsers/models/shared-models/page-parser/page-parser';
import { DraftKingsOddButtonParserSet, OddButtonParserSet } from '@/parsers';
import { DraftKingsJsonGamesParser } from './json-games-parser';

export class DraftKingsPageParser extends PageParser {
  private wrappedJsonGamesParser: DraftKingsJsonGamesParser | undefined;

  public static async create({
    pageParserInitData,
  }: {
    pageParserInitData: PageParserInitData,
  }): Promise<DraftKingsPageParser> {
    const draftKingsPageParser = new DraftKingsPageParser({ initData: pageParserInitData });
    await draftKingsPageParser.init();
    return draftKingsPageParser;
  }

  protected async initOddButtonParserSet(): Promise<OddButtonParserSet> {
    this.jsonGamesParser = await DraftKingsJsonGamesParser.create({ parentPageParser: this });
    this.oddButtonParserSet = await DraftKingsOddButtonParserSet.create({ parentPageParser: this });
    return this.oddButtonParserSet
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