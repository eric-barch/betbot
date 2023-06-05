import { PageParser } from '@/parsers/models/base-models/page-parser/page-parser';
import { JsonGamesParser } from './json-games-parser';
import { OddHandleSet } from './odd-handle-set';
import { config, draftKings, mlb, gamesPageType } from '@/config';

export class DraftKingsGamesPageParser extends PageParser {
  private jsonGamesParser: JsonGamesParser;
  private oddHandleSet: OddHandleSet;

  constructor() {
    const exchangeInitData = draftKings;
    const leagueInitData = mlb;
    const pageTypeInitData = gamesPageType;

    const pageParserInitData = config.findPageParserInitData({
      exchangeInitData,
      leagueInitData,
      pageTypeInitData,
    });

    super({ pageParserInitData });

    this.jsonGamesParser = new JsonGamesParser({ pageParser: this });
    this.oddHandleSet = new OddHandleSet({ pageParser: this });
  }

  public static async create(): Promise<DraftKingsGamesPageParser> {
    const pageParser = new DraftKingsGamesPageParser();
    await pageParser.init();
    await pageParser.jsonGamesParser.ensureGamesInDb();
    await pageParser.oddHandleSet.init();
    return pageParser;
  }
}