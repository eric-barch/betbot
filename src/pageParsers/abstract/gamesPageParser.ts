import { PageParser } from './pageParser';
import * as db from '../../db';

export abstract class GamesPageParser extends PageParser {
    public abstract getGames(): Promise<db.Game[]>;
}