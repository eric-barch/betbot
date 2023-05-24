import { PageParser } from '.';

import * as db from '../../db';

export abstract class GamesPageParser extends PageParser {
  public abstract getGames(): Promise<Array<db.models.Game>>;
}
