import * as db from '../../db';
import * as pageParsers from '../../pageParsers';

export class SugarHouseGamesPageParser extends pageParsers.GamesPageParser {
    protected wrappedWebpageConnector: pageParsers.WebpageConnector;

    constructor() {
        super();
        this.wrappedWebpageConnector = new pageParsers.WebpageConnector({
            url: 'bar',
        });
    }

    public async getGames(): Promise<Array<db.Game>> {
        return new Array<db.Game>;
    }
}