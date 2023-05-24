import * as c from 'chrono-node';
import * as p from 'puppeteer';
import * as s from 'sequelize';

import * as baseModels from '../../../../shared-models';
import * as db from '../../../../../db';

export class DocumentGamesParser {
  private gamesPageParser: baseModels.GamesPageParser;

  constructor({ gamesPageParser }: { gamesPageParser: baseModels.GamesPageParser }) {
    this.gamesPageParser = gamesPageParser;
  }

  public async getGames(): Promise<Array<db.models.Game>> {
    const games = new Array<db.models.Game>();

    const gameElements = await this.getGameElements();

    for (const gameElement of gameElements) {
      const matchupTeams = await this.getMatchupTeams({ gameElement });

      const awayTeam = matchupTeams.awayTeam;
      const homeTeam = matchupTeams.homeTeam;
      const startDate = await this.getStartDate({ gameElement });

      const game = await db.models.Game.findOrCreateByAwayTeamHomeTeamStartDate({
        awayTeam,
        homeTeam,
        startDate,
      });

      games.push(game);
    }

    return games;
  }

  private async getGameElements(): Promise<Array<p.ElementHandle>> {
    const gameElements = new Array<p.ElementHandle>();

    const gameLinkElements = await this.getGameLinkElements();

    for (const gameLinkElement of gameLinkElements) {
      const gameElement = await gameLinkElement.$('xpath/../../../..');

      if (!gameElement) {
        throw new Error(`gameElement is null.`);
      }

      gameElements.push(gameElement);
    }

    return gameElements;
  }

  private async getGameLinkElements(): Promise<Array<p.ElementHandle>> {
    const teams = await db.models.Team.findAll();
    const teamNames = teams.map((team) => team.nameFull);
    const teamNamesJoined = teamNames.join(`|`);
    const regex = new RegExp(`(${teamNamesJoined}).*@.*(${teamNamesJoined})`, `i`);

    const linkElements = await this.gamesPageParser.page.$$('a');

    let firstGameLinkElement;

    for (const linkElement of linkElements) {
      const title = await (await linkElement.getProperty('title')).jsonValue();

      if (regex.test(title)) {
        firstGameLinkElement = linkElement;
        break;
      }
    }

    if (!firstGameLinkElement) {
      throw new Error(`Did not find first game link element.`);
    }

    const gameLinkClassName = await (
      await firstGameLinkElement.getProperty('className')
    ).jsonValue();
    const gameLinkElements = await this.gamesPageParser.page.$$(`a[class='${gameLinkClassName}']`);

    return gameLinkElements;
  }

  private async getMatchupTeams({ gameElement }: { gameElement: p.ElementHandle }): Promise<{
    awayTeam: db.models.Team;
    homeTeam: db.models.Team;
  }> {
    const spansWithAriaLabel = await gameElement.$$('span[aria-label]');

    const matchupTeams = new Array<db.models.Team>();

    for (const spanWithAriaLabel of spansWithAriaLabel) {
      const textContent = await (await spanWithAriaLabel.getProperty('textContent')).jsonValue();

      if (!textContent) {
        continue;
      }

      try {
        const team = await db.models.Team.findByUnformattedName({
          unformattedName: textContent,
        });
        matchupTeams.push(team);
      } catch {
        continue;
      }
    }

    if (matchupTeams.length !== 2) {
      throw new Error(`matchupTeams.length is not equal to 2.`);
    }

    return {
      awayTeam: matchupTeams[0],
      homeTeam: matchupTeams[1],
    };
  }

  private async getStartDate({ gameElement }: { gameElement: p.ElementHandle }): Promise<Date> {
    const startDateElement = await gameElement.$$('time');

    if (startDateElement.length !== 1) {
      return new Date();
    }

    const startDateText = await (await startDateElement[0].getProperty('textContent')).jsonValue();

    if (!startDateText) {
      throw new Error(`timeText is null.`);
    }

    const startDateTextStripped = startDateText.replace(/(am|pm)(.*)$/i, '$1');

    const startDate = c.parseDate(startDateTextStripped);

    return startDate;
  }
}
