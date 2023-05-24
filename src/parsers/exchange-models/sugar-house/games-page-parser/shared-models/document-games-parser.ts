import * as c from 'chrono-node';
import * as p from 'puppeteer';

import * as baseModels from '../../../../shared-models';
import * as db from '../../../../../db';

export class DocumentGamesParser {
  private gamesPageParser: baseModels.GamesPageParser;

  constructor({ gamesPageParser }: { gamesPageParser: baseModels.GamesPageParser }) {
    this.gamesPageParser = gamesPageParser;
  }

  public async getGames(): Promise<Array<db.models.Game>> {
    const games = new Array<db.models.Game>();

    const gameElements = await this.gamesPageParser.page.$$('article');

    for (const gameElement of gameElements) {
      const gameDetailStrings = await this.getGameDetailStrings({
        gameElement,
      });

      const awayTeam = await db.models.Team.findByUnformattedName({
        unformattedName: gameDetailStrings.awayTeam,
      });
      const homeTeam = await db.models.Team.findByUnformattedName({
        unformattedName: gameDetailStrings.homeTeam,
      });
      const startDate = c.parseDate(gameDetailStrings.startDate);

      const game = await db.models.Game.findOrCreateByAwayTeamHomeTeamStartDate({
        awayTeam,
        homeTeam,
        startDate,
      });

      games.push(game);
    }

    return games;
  }

  private async getGameDetailStrings({ gameElement }: { gameElement: p.ElementHandle }): Promise<{
    awayTeam: string;
    homeTeam: string;
    startDate: string;
  }> {
    const gameDetailsElement = await gameElement.$('xpath/div/div');

    if (!gameDetailsElement) {
      throw new Error(`gameDetailsElement is null.`);
    }

    const ariaLabel = await (await gameDetailsElement.getProperty('ariaLabel')).jsonValue();

    if (!ariaLabel) {
      throw new Error(`ariaLabel is null`);
    }

    const awayTeamNamePattern = new RegExp('^([^@]*)@');
    const homeTeamNamePattern = new RegExp('@([^,]*),');
    const startDatePattern = new RegExp(',(.*)$');

    const awayTeamNameStrings = ariaLabel.match(awayTeamNamePattern);
    const homeTeamNameStrings = ariaLabel.match(homeTeamNamePattern);
    const startDateStrings = ariaLabel.match(startDatePattern);

    if (!awayTeamNameStrings || !homeTeamNameStrings || !startDateStrings) {
      throw new Error(`One or more detail string is null.`);
    }

    return {
      awayTeam: awayTeamNameStrings[1],
      homeTeam: homeTeamNameStrings[1],
      startDate: startDateStrings[1],
    };
  }
}
