import { Parser } from '../base-models';

import * as db from '../../db';

export abstract class GamesPageParser extends Parser {
    public abstract getGames(): Promise<Array<db.models.Game>>;
}