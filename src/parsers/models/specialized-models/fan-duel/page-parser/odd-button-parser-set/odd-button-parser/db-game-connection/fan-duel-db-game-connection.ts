import { Team } from '@prisma/client';
import { parseDate } from 'chrono-node';

import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { DbGameConnection } from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/db-connection/db-game-connection';

import { FanDuelJsonGameParser } from './fan-duel-json-game-parser';

export class FanDuelDbGameConnection extends DbGameConnection {
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedJsonGameParser: FanDuelJsonGameParser | undefined;

  protected async findOrCreateGame(): Promise<GameWithTeams> {
    await this.parseMatchupAndExchangeAssignedGameId();

    try {
      return await GameService.findByExchangeAndExchangeAssignedGameId({
        exchange: this.parentDbGameConnection.exchange,
        exchangeAssignedGameId: this.exchangeAssignedGameId,
      });
    } catch { }

    try {
      return await this.findOrCreateGameByJson();
    } catch { }

    try {
      return await this.findOrCreateGameByMatchupAndStartDate();
    } catch { }

    throw new Error(`Failed to find or create db game.`);
  }

  private async parseMatchupAndExchangeAssignedGameId(): Promise<FanDuelDbGameConnection> {
    const button = this.parentDbGameConnection.button!;
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

    const league = this.parentDbGameConnection.league;

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
      parentDbGameConnection: this.parentDbGameConnection,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.jsonGameParser.game;
    return this.game;
  }

  private async findOrCreateGameByMatchupAndStartDate(): Promise<GameWithTeams> {
    try {
      this.startDate = await this.getStartDate();
      this.game = await GameService.findOrCreateByMatchupAndStartDate({
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        startDate: this.startDate,
        createdBy: 'FanDuel findOrCreateGameByMatchupAndStartDate',
      });
    } catch {
      const startDate = new Date();
      this.game = await GameService.findByMatchupAndStartDate({
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        startDate,
      });
    }

    const exchangeId = this.parentDbGameConnection.exchange.id;
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
    const button = this.parentDbGameConnection.button!;
    const liElement = await button.evaluateHandle((el) => (el.closest('li')!));
    const startDateElement = (await liElement.$('time'))!;
    let startDateText = await startDateElement.evaluate((el) => (el.textContent!));
    startDateText = startDateText.toLowerCase().replace(/(am|pm)(.*)$/i, '$1');
    this.startDate = parseDate(startDateText);
    return this.startDate;
  }

  private set awayTeam(awayTeam: Team) {
    this.wrappedAwayTeam = awayTeam;
  }

  private get awayTeam(): Team {
    if (this.wrappedAwayTeam === undefined) {
      throw new Error(`wrappedAwayTeam is undefined.`);
    }

    return this.wrappedAwayTeam;
  }

  private set homeTeam(homeTeam: Team) {
    this.wrappedHomeTeam = homeTeam;
  }

  private get homeTeam(): Team {
    if (this.wrappedHomeTeam === undefined) {
      throw new Error(`wrappedHomeTeam is undefined.`);
    }

    return this.wrappedHomeTeam;
  }

  private set startDate(startDate: Date) {
    this.wrappedStartDate = startDate;
  }

  private get startDate(): Date {
    if (this.wrappedStartDate === undefined) {
      throw new Error(`wrappedStartDate is undefined.`);
    }

    return this.wrappedStartDate;
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

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }

  private get game(): GameWithTeams {
    if (this.wrappedGame === undefined) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }
}