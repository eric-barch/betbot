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

    public async getGames(): Promise<Array<db.models.Game>> {
        const jsonGames = await this.getJsonGames();
        const games = await this.parseJsonGamesToSequelizeGames({ jsonGames });
        return games;
    }

    private async getJsonGames(): Promise<Array<any>> {
        const jsonGamesElement = await this.gamesPageParser.page.$('script[type="application/ld+json"][data-react-helmet="true"]');

        if (!jsonGamesElement) {
            throw new Error(`jsonGamesElement is null.`);
        }
    
        const textContent = await (await jsonGamesElement.getProperty('textContent')).jsonValue();
    
        if (!textContent) {
            throw new Error(`textContent is null.`);
        }

        const jsonGames = JSON.parse(textContent);

        return jsonGames;
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
        const unformattedName = await jsonTeam.name;
        const team = await db.models.Team.findByUnformattedName({ unformattedName });
        return team;
    }
}