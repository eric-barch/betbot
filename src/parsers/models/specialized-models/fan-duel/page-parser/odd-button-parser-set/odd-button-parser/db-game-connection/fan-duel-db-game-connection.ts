import { parseDate } from 'chrono-node';

import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';
import {
  DbGameConnection,
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/db-connection/db-game-connection';

import { FanDuelJsonGameParser } from './fan-duel-json-game-parser';

export class FanDuelDbGameConnection extends DbGameConnection {
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedJsonGameParser: FanDuelJsonGameParser | undefined;

  public static async create({
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<FanDuelDbGameConnection> {
    const fanDuelDbGameConnection = new FanDuelDbGameConnection({ parent });
    await fanDuelDbGameConnection.init();
    return fanDuelDbGameConnection;
  }

  protected async findOrCreateGame(): Promise<GameWithTeams> {
    await this.parseMatchupAndExchangeAssignedGameId();

    try {
      this.game = await GameService.findByExchangeAndExchangeAssignedGameId({
        exchange: this.parent.parent.exchange,
        exchangeAssignedGameId: this.exchangeAssignedGameId,
      });
      return this.game;
    } catch { }

    try {
      this.game = await this.findOrCreateGameByJson();
      return this.game;
    } catch { }

    try {
      this.game = await this.findOrCreateGameByMatchupAndStartDate();
      return this.game;
    } catch { }

    throw new Error(`Failed to find or create db game.`);
  }

  private async parseMatchupAndExchangeAssignedGameId(): Promise<FanDuelDbGameConnection> {
    const button = this.parent.button!;
    const parentLi = await button.evaluateHandle((el) => (el.closest('li')!));
    const eventCellLink = (await parentLi.$('a'))!;
    const href = await eventCellLink.evaluate((el) => (el.getAttribute('href')!));
    await this.parseMatchup({ href });
    this.parseExchangeAssignedGameId({ href });
    return this;
  }

  private async parseMatchup({
    href,
  }: {
    href: string,
  }): Promise<FanDuelDbGameConnection> {
    const teamNamesMatchPattern = new RegExp(/\/([^/]+)@([^/]+)/);
    const teamNameMatches = teamNamesMatchPattern.exec(href);

    if (!teamNameMatches || teamNameMatches.length !== 3) {
      throw new Error(`Incorrect number of teamNameMatches.`);
    }

    const league = this.parent.parent.league;

    this.awayTeam = await TeamService.findByUnformattedNameAndLeague({
      league,
      unformattedName: teamNameMatches[1],
    });

    this.homeTeam = await TeamService.findByUnformattedNameAndLeague({
      league,
      unformattedName: teamNameMatches[2],
    });

    return this;
  }

  private parseExchangeAssignedGameId({
    href,
  }: {
    href: string,
  }): FanDuelDbGameConnection {
    const exchangeAssignedGameIdMatchPattern = new RegExp(/-([^/-]+)$/);
    const exchangeAssignedGameIdMatches = exchangeAssignedGameIdMatchPattern.exec(href);

    if (!exchangeAssignedGameIdMatches || exchangeAssignedGameIdMatches.length !== 2) {
      throw new Error(`Incorrect number of exchangeAssignedGameIdMatches.`);
    }

    this.exchangeAssignedGameId = exchangeAssignedGameIdMatches[1];

    return this;
  }

  private async findOrCreateGameByJson(): Promise<GameWithTeams> {
    this.jsonGameParser = await FanDuelJsonGameParser.create({
      parent: this,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.jsonGameParser.game;
    return this.game;
  }

  private async findOrCreateGameByMatchupAndStartDate(): Promise<GameWithTeams> {
    try {
      /**If a startDate is available, we use it to find OR create the db game. */
      this.startDate = await this.getStartDate();
      this.game = await GameService.findOrCreateByMatchupAndStartDate({
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        startDate: this.startDate,
        createdBy: 'FanDuel findOrCreateGameByMatchupAndStartDate',
      });
    } catch {
      /**If we can't find a startDate, we use the current time only to FIND the game. We do not use 
      * the current time to CREATE a game. */
      const startDate = new Date();
      this.game = await GameService.findByMatchupAndStartDate({
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        startDate,
      });
    }

    const exchangeId = this.parent.parent.exchange.id;
    const gameId = this.game.id;
    const exchangeAssignedGameId = this.exchangeAssignedGameId;

    await prisma.exchangeToGame.upsert({
      where: {
        exchangeId_gameId: {
          exchangeId,
          gameId,
        },
      },
      update: {
        exchangeAssignedGameId,
      },
      create: {
        exchangeId,
        gameId,
        exchangeAssignedGameId,
      },
    });

    return this.game;
  }

  private async getStartDate(): Promise<Date> {
    const button = this.parent.button!;
    const liElement = await button.evaluateHandle((el) => (el.closest('li')!));
    const startDateElement = (await liElement.$('time'))!;
    let startDateText = await startDateElement.evaluate((el) => (el.textContent!));
    startDateText = startDateText.toLowerCase().replace(/(am|pm)(.*)$/i, '$1');
    this.startDate = parseDate(startDateText);
    return this.startDate;
  }

  private set exchangeAssignedGameId(exchangeAssignedGameId: string) {
    this.wrappedExchangeAssignedGameId = exchangeAssignedGameId;
  }

  private get exchangeAssignedGameId(): string {
    if (this.wrappedExchangeAssignedGameId === undefined) {
      throw new Error(`wrappedExchangeAssignedGameId is undefined.`);
    }

    return this.wrappedExchangeAssignedGameId;
  }

  private set jsonGameParser(jsonGameParser: FanDuelJsonGameParser) {
    this.wrappedJsonGameParser = jsonGameParser;
  }

  private get jsonGameParser(): FanDuelJsonGameParser {
    if (this.wrappedJsonGameParser === undefined) {
      throw new Error(`wrappedJsonGameParser is undefined.`);
    }

    return this.wrappedJsonGameParser;
  }
}