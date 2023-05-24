import { DocumentGamesParser } from './document-games-parser';

import * as baseModels from '../../../base-models';
import * as db from '../../../../db';

export class SugarHouseNbaGamesPageParser extends baseModels.GamesPageParser {
    private documentGamesParser: DocumentGamesParser;

    constructor() {
        super({ url: 'https://ct.playsugarhouse.com/?page=sportsbook&group=1000093652&type=matches#home' });
        this.documentGamesParser = new DocumentGamesParser({ gamesPageParser: this });
    }

    public async getGames(): Promise<Array<db.models.Game>> {
        const games = await this.documentGamesParser.getGames();
        return games;
    }
}