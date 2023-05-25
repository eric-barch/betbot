import { JsonGamesParser } from './json-games-parser';
import { DocumentGamesParser } from './document-games-parser';

import * as baseModels from '../../../../shared-models';
import * as db from '../../../../../db';

export abstract class FanDuelGamesPageParser extends baseModels.GamesPageParser {
  private jsonGamesParser: JsonGamesParser;
  private documentGamesParser: DocumentGamesParser;

  constructor({ url }: { url: string }) {
    super({ url });
    this.jsonGamesParser = new JsonGamesParser({ gamesPageParser: this });
    this.documentGamesParser = new DocumentGamesParser({ gamesPageParser: this });
  }

  protected async scrapeGames(): Promise<Array<db.models.Game>> {
    await this.jsonGamesParser.getGames();
    const games = await this.documentGamesParser.getGames();
    return games;
  }
}
