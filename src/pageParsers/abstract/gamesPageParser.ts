import { PageParser } from './pageParser';
import * as db from '../../db/_index';

export abstract class GamesPageParser extends PageParser {
    public abstract getGames(): Promise<Array<db.models.Game>>;
}