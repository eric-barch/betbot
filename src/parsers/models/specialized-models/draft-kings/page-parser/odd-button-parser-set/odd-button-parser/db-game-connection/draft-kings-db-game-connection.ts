import { Team } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { DbGameConnection, SpecializedDbGameConnection } from '@/parsers/models/common-models';

import { DraftKingsJsonGameParser } from './draft-kings-json-game-parser';
import { DraftKingsStartDateParser } from './draft-kings-start-date-parser';

export class DraftKingsDbGameConnection implements SpecializedDbGameConnection {
  private readonly parentDbGameConnection: DbGameConnection;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedStartDateParser: DraftKingsStartDateParser | undefined;
  private wrappedJsonGameParser: DraftKingsJsonGameParser | undefined;
  private wrappedGame: GameWithTeams | undefined;

  public constructor({
    parentDbGameConnection,
  }: {
    parentDbGameConnection: DbGameConnection,
  }) {
    this.parentDbGameConnection = parentDbGameConnection;
  }

  public async findOrCreateGame(): Promise<GameWithTeams> {
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

  private async parseMatchupAndExchangeAssignedGameId(): Promise<DraftKingsDbGameConnection> {
    const button = this.parentDbGameConnection.button;

    if (!button) {
      throw new Error(`button is null.`);
    }

    const parentTr = await button.evaluateHandle((el) => (el.closest('tr')));

    if (!(parentTr instanceof ElementHandle)) {
      throw new Error(`parentTr is null.`);
    }

    const eventCellLink = await parentTr.$('a.event-cell-link');

    if (!eventCellLink) {
      throw new Error(`eventCellLink is null.`);
    }

    const href = await eventCellLink.evaluate((el) => (el.getAttribute('href')));

    if (!href) {
      throw new Error(`href is null.`);
    }

    await this.parseMatchup({ href });
    this.parseExchangeAssignedGameId({ href });

    return this;
  }

  private async parseMatchup({
    href,
  }: {
    href: string,
  }): Promise<DraftKingsDbGameConnection> {
    const teamNamesMatchPattern = new RegExp(/\/([^/]+)%40([^/]+)\//);
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
  }): DraftKingsDbGameConnection {
    const exchangeAssignedGameIdMatchPattern = new RegExp(/\/([^/]+)$/);
    const exchangeAssignedGameIdMatches = exchangeAssignedGameIdMatchPattern.exec(href);

    if (!exchangeAssignedGameIdMatches || exchangeAssignedGameIdMatches.length !== 2) {
      throw new Error(`Incorrect number of exchangeAssignedGameIdMatches.`);
    }

    this.exchangeAssignedGameId = exchangeAssignedGameIdMatches[1];

    return this;
  }

  private async findOrCreateGameByJson(): Promise<GameWithTeams> {
    this.jsonGameParser = await DraftKingsJsonGameParser.create({
      parentDbGameConnection: this.parentDbGameConnection,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.jsonGameParser.game;
    return this.game;
  }

  private async findOrCreateGameByMatchupAndStartDate(): Promise<GameWithTeams> {
    try {
      /**If a positive startDate is available, we use it to find OR create the db game. */
      this.startDateParser = await DraftKingsStartDateParser.create({
        parentDbGameConnection: this.parentDbGameConnection,
      });
      this.game = await GameService.findOrCreateByMatchupAndStartDate({
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        startDate: this.startDateParser.startDate,
      });
    } catch {
      /**If we can't find a positive startDate, we use the current time only to FIND the game 
       * if it exists in the db already. We don't use the current time to CREATE a db game. */
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

  private set awayTeam(awayTeam: Team) {
    this.wrappedAwayTeam = awayTeam;
  }

  private get awayTeam(): Team {
    if (!this.wrappedAwayTeam) {
      throw new Error(`wrappedAwayTeam is undefined.`);
    }

    return this.wrappedAwayTeam;
  }

  private set homeTeam(homeTeam: Team) {
    this.wrappedHomeTeam = homeTeam;
  }

  private get homeTeam(): Team {
    if (!this.wrappedHomeTeam) {
      throw new Error(`wrappedHomeTeam is undefined.`);
    }

    return this.wrappedHomeTeam;
  }

  private set exchangeAssignedGameId(exchangeAssignedGameId: string) {
    this.wrappedExchangeAssignedGameId = exchangeAssignedGameId;
  }

  private get exchangeAssignedGameId(): string {
    if (!this.wrappedExchangeAssignedGameId) {
      throw new Error(`wrappedExchangeAssignedGameId is undefined.`);
    }

    return this.wrappedExchangeAssignedGameId;
  }

  private set startDateParser(startDateParser: DraftKingsStartDateParser) {
    this.wrappedStartDateParser = startDateParser;
  }

  private get startDateParser(): DraftKingsStartDateParser {
    if (!this.wrappedStartDateParser) {
      throw new Error(`wrappedStartDateParser is undefined.`);
    }

    return this.wrappedStartDateParser;
  }

  private set jsonGameParser(jsonGameParser: DraftKingsJsonGameParser) {
    this.wrappedJsonGameParser = jsonGameParser;
  }

  private get jsonGameParser(): DraftKingsJsonGameParser {
    if (this.wrappedJsonGameParser === undefined) {
      throw new Error(`wrappedJsonGameParser is undefined.`);
    }

    return this.wrappedJsonGameParser;
  }

  private set game(game: GameWithTeams) {
    this.wrappedGame = game;
  }

  private get game(): GameWithTeams {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }
}