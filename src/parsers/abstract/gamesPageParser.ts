import { WebpageConnector } from './webpageConnector';
import * as db from '../../db';

export abstract class GamesPageParser {
    protected abstract wrappedWebpageConnector: WebpageConnector;

    public abstract getGames(): Promise<db.Game[]>;
}