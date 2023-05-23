import * as baseModels from '../../../base-models';
import * as db from '../../../../db';

export class JsonGamesParser {
    private gamesPageParser: baseModels.GamesPageParser;

    constructor({
        gamesPageParser,
    }: {
        gamesPageParser: baseModels.GamesPageParser,
    }) {
        this.gamesPageParser = gamesPageParser;
    }

    public async ensureJsonGamesRepresentedInDatabase(): Promise<Array<db.models.Game>> {
        const jsonGames = await this.getGamesInJsonFormat();
        const games = await this.parseJsonGamesToSequelizeGames({ jsonGames });
        return games;
    }

    private async getGamesInJsonFormat(): Promise<Array<any>> {
        const gamesInJsonFormat = new Array;

        const gameScriptElements = await this.gamesPageParser.page.$$('script[type="application/ld+json"]');

        for (const gameScriptElement of gameScriptElements) {
            const textContent = await (await gameScriptElement.getProperty('textContent')).jsonValue();

            if (!textContent) {
                continue;
            }

            const gameInJsonFormat = JSON.parse(textContent);
            gamesInJsonFormat.push(gameInJsonFormat);
        }

        return gamesInJsonFormat;
    }

    private async parseJsonGamesToSequelizeGames({
        jsonGames,
    }: {
        jsonGames: Array<any>,
    }): Promise<Array<db.models.Game>> {
        const games = new Array<db.models.Game>;

        for (const jsonGame of jsonGames) {
            const awayTeam = await this.parseJsonTeamToSequelizeTeam({ jsonTeam: jsonGame.awayTeam });
            const homeTeam = await this.parseJsonTeamToSequelizeTeam({ jsonTeam: jsonGame.homeTeam });
            const startDate = new Date(jsonGame.startDate);

            const game = await db.models.Game.findOrCreateByAwayTeamHomeTeamStartDate({
                awayTeam,
                homeTeam,
                startDate,
            });
    
            games.push(game);
        }

        return games;
    }

    private async parseJsonTeamToSequelizeTeam({
        jsonTeam,
    }: {
        jsonTeam: any,
    }): Promise<db.models.Team> {
        const unformattedName = jsonTeam.name;
        const team = await db.models.Team.findByUnformattedName({ unformattedName });
        return team;
    }

}