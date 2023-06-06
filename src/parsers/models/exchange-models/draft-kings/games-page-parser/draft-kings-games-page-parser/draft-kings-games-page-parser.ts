import { LeagueInitData, config, draftKings, gamesPageType, mlb } from '@/config';
import { PageParser } from '@/parsers/models/base-models/page-parser/page-parser';
import { JsonGamesParser } from './json-games-parser';
import { OddHandleSet } from './odd-handle-set';

export abstract class DraftKingsGamesPageParser extends PageParser {
  private jsonGamesParser: JsonGamesParser | undefined;
  private oddHandleSet: OddHandleSet | undefined;

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
    pageParser.jsonGamesParser = await JsonGamesParser.create({ parentPageParser: pageParser });
    pageParser.oddHandleSet = await OddHandleSet.create({ parentPageParser: pageParser });
    return pageParser;
  }
}