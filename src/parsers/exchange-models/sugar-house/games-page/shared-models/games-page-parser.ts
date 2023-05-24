import { DocumentGamesParser } from './document-games-parser';

import * as baseModels from '../../../../shared-models';
import * as db from '../../../../../db';

export abstract class SugarHouseGamesPageParser extends baseModels.GamesPageParser {
  private documentGamesParser: DocumentGamesParser;

  constructor({ url }: { url: string }) {
    super({ url });
    this.documentGamesParser = new DocumentGamesParser({ gamesPageParser: this });
  }

  public async getGames(): Promise<Array<db.models.Game>> {
    const games = await this.documentGamesParser.getGames();
    return games;
  }
}
