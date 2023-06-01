import * as c from 'chrono-node';
import * as p from 'puppeteer';

import { PageParser } from '@/page-parsers';
import { Game, Team } from '@prisma/client';
import { DbUtilityFunctions } from '@/db';

export class DocumentGamesParser {
  private pageParser: PageParser;
  private tableRowElements: Array<p.ElementHandle>;
  private games: Array<Game>;

  constructor({
    pageParser,
  }: {
    pageParser: PageParser,
  }) {
    this.pageParser = pageParser;
    this.tableRowElements = new Array<p.ElementHandle>;
    this.games = new Array<Game>;
  }

  public async getGames(): Promise<Array<Game>> {
    await this.scrapeTableRowElements();
    await this.parseGames();
    return this.games;
  }

  private async scrapeTableRowElements(): Promise<Array<p.ElementHandle>> {
    const tableRowElements = await this.pageParser.page.$$(
      'th.sportsbook-table__column-row[scope="row"]'
    );

    this.tableRowElements = tableRowElements;

    return tableRowElements;
  }

  /**TODO: Revise implementation so that monitoring refresh state of webpage is no longer necessary.
   * Should base team names solely on visible team name text. The link text that the program
   * currently uses is unreliable. */
  private async parseGames(): Promise<Array<Game>> {
    for (const tableRowElement of this.tableRowElements) {
      let game: Game;

      try {
        game = await this.parseGame({ tableRowElement });
      } catch (e) {
        continue;
      }

      this.games.push(game);
    }

    return this.games;
  }

  private async parseGame({
    tableRowElement,
  }: {
    tableRowElement: p.ElementHandle,
  }): Promise<Game> {
    const tableRowTeam = await this.getTableRowTeam({ tableRowElement });
    const tableRowMatchup = await this.getTableRowMatchup({ tableRowElement });

    const awayTeam = tableRowMatchup.awayTeam;
    const homeTeam = tableRowMatchup.homeTeam;

    /**startDate is mapped from the away team row handle, so we throw away any row elements that do
     * not correspond to an away team row. */
    if (tableRowTeam.id !== awayTeam.id) {
      throw new Error(`Table row is not an away team row.`);
    }

    const startDate = await this.getStartDate({ tableRowElement });

    const game = await DbUtilityFunctions.findOrCreateDbGame({
      awayTeam,
      homeTeam,
      startDate,
    });

    return game;
  }

  private async getTableRowTeam({
    tableRowElement,
  }: {
    tableRowElement: p.ElementHandle,
  }): Promise<Team> {
    const teamNameElement = await tableRowElement.$('.event-cell__name-text');

    if (!teamNameElement) {
      throw new Error(`teamNameElement is null.`);
    }

    const unformattedName = await (await teamNameElement.getProperty('textContent')).jsonValue();

    if (!unformattedName) {
      throw new Error(`unformattedName is null.`);
    }

    const team = await DbUtilityFunctions.findDbTeam({
      unformattedName,
      league: this.pageParser.league,
    })

    return team;
  }

  private async getTableRowMatchup({
    tableRowElement,
  }: {
    tableRowElement: p.ElementHandle,
  }) {
    const matchupString = await this.getMatchupString({ tableRowElement });

    const awayTeamNamePattern = new RegExp('/([^/]*)%40');
    const homeTeamNamePattern = new RegExp('%40([^/]*)/');

    const awayTeamNameMatches = matchupString.match(awayTeamNamePattern);
    const homeTeamNameMatches = matchupString.match(homeTeamNamePattern);

    if (!awayTeamNameMatches || awayTeamNameMatches.length !== 2) {
      throw new Error(`awayTeamNameMatches is null or not equal to 2.`);
    }

    if (!homeTeamNameMatches || homeTeamNameMatches.length !== 2) {
      throw new Error(`homeTeamName is null or not equal to 2.`);
    }

    const unformattedAwayName = awayTeamNameMatches[1].replace(/[^a-zA-Z]/g, ' ');
    const unformattedHomeName = homeTeamNameMatches[1].replace(/[^a-zA-Z]/g, ' ');

    const league = this.pageParser.league;

    const awayTeam = await DbUtilityFunctions.findDbTeam({
      unformattedName: unformattedAwayName,
      league,
    });

    const homeTeam = await DbUtilityFunctions.findDbTeam({
      unformattedName: unformattedHomeName,
      league,
    });

    return {
      awayTeam: awayTeam,
      homeTeam: homeTeam,
    };
  }

  private async getMatchupString({
    tableRowElement
  }: {
    tableRowElement: p.ElementHandle
  }): Promise<string> {
    const linkElement = await tableRowElement.$('.event-cell-link');

    if (!linkElement) {
      throw new Error(`linkElement is null.`);
    }

    const hrefString = await (await linkElement.getProperty('href')).jsonValue();

    if (typeof hrefString !== 'string') {
      throw new Error(`hrefString is not a string.`);
    }

    const matchupPattern = new RegExp('/[^/]*%40[^/]*/');
    const matchupStrings = hrefString.match(matchupPattern);

    if (!matchupStrings) {
      throw new Error(`matchupStrings is null.`);
    }

    const matchupString = matchupStrings[0];

    return matchupString;
  }

  private async getStartDate({
    tableRowElement
  }: {
    tableRowElement: p.ElementHandle
  }) {
    const dateString = await this.getDateString({ tableRowElement });
    const timeString = await this.getTimeString({ tableRowElement });

    const startDateString = `${dateString} ${timeString}`;
    const startDate = c.parseDate(startDateString);

    return startDate;
  }

  private async getDateString({
    tableRowElement
  }: {
    tableRowElement: p.ElementHandle
  }) {
    const tableElement = await tableRowElement.$('xpath/../../..');

    if (!tableElement) {
      throw new Error(`tableElement is null.`);
    }

    const dateStringElement = await tableElement.$('th[scope="col"].always-left.column-header');

    if (!dateStringElement) {
      throw new Error(`dateStringElement is null.`);
    }

    const dateString = await (await dateStringElement.getProperty('textContent')).jsonValue();

    if (!dateString) {
      throw new Error(`dateString is null.`);
    }

    return dateString;
  }

  private async getTimeString({
    tableRowElement
  }: {
    tableRowElement: p.ElementHandle
  }): Promise<string> {
    const timeStringElement = await tableRowElement.$('.event-cell__start-time');

    if (!timeStringElement) {
      return 'NOW';
    }

    const timeString = await (await timeStringElement.getProperty('textContent')).jsonValue();

    if (!timeString) {
      throw new Error('timeString is null.');
    }

    return timeString;
  }
}