import { LeagueInitData, config, draftKings, gamesPageType } from '@/config';
import { PageParser } from '@/parsers/models/base-models/page-parser/page-parser';
import { JsonGamesParser } from './json-games-parser';
import { OddHandleSet } from './odd-handle-set';

export abstract class DraftKingsGamesPageParser extends PageParser {
  private wrappedJsonGamesParser: JsonGamesParser | undefined;
  private wrappedOddHandleSet: OddHandleSet | undefined;

  protected constructor({
    leagueInitData,
  }: {
    leagueInitData: LeagueInitData,
  }) {
    const exchangeInitData = draftKings;
    const pageTypeInitData = gamesPageType;

    const pageParserInitData = config.findPageParserInitData({
      exchangeInitData,
      leagueInitData,
      pageTypeInitData,
    });

    super({ pageParserInitData });
  }

  public static async create<T extends DraftKingsGamesPageParser>(this: new () => T): Promise<DraftKingsGamesPageParser> {
    const pageParser = new this();
    await pageParser.init();
    pageParser.wrappedJsonGamesParser = await JsonGamesParser.create({ parentPageParser: pageParser });
    pageParser.wrappedOddHandleSet = await OddHandleSet.create({ parentPageParser: pageParser });
    return pageParser;
  }

  public async update(): Promise<DraftKingsGamesPageParser> {
    await this.jsonGamesParser.update();
    await this.oddHandleSet.update();
    return this;
  }

  private get jsonGamesParser(): JsonGamesParser {
    if (!this.wrappedJsonGamesParser) {
      throw new Error(`wrappedJsonGamesParser is undefined.`);
    }

    return this.wrappedJsonGamesParser;
  }

  private get oddHandleSet(): OddHandleSet {
    if (!this.wrappedOddHandleSet) {
      throw new Error(`wrappedOddHandleSet is undefined.`);
    }

    return this.wrappedOddHandleSet;
  }
}