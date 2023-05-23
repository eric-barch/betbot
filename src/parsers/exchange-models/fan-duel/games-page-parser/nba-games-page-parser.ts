import { JsonGamesParser } from './json-games-parser';
import { DocumentGamesParser } from './document-games-parser';

import * as baseModels from '../../../base-models';
import * as db from '../../../../db';

export class FanDuelNbaGamesPageParser extends baseModels.GamesPageParser {
    private jsonGamesParser: JsonGamesParser;
    private documentGamesParser: DocumentGamesParser;

    constructor() {
        super({ url: 'https://sportsbook.fanduel.com/navigation/nba' });
        this.jsonGamesParser = new JsonGamesParser({ gamesPageParser: this });
        this.documentGamesParser = new DocumentGamesParser({ gamesPageParser: this });
    }

    public async getGames(): Promise<Array<db.models.Game>> {
        await this.jsonGamesParser.getGames();
        const games = await this.documentGamesParser.getGames();
        return games;
    }
}