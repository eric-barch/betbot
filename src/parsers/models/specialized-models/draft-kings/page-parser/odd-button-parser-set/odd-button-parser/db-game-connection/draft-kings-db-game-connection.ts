import { GameService, GameWithTeams, TeamService, prisma } from '@/db';
import { OddButtonParser } from '@/parsers/models/common-models';
import {
  DbGameConnection
} from '@/parsers/models/common-models/page-parser/odd-button-parser-set/odd-button-parser/db-connection/db-game-connection';

import { DraftKingsJsonGameParser } from './draft-kings-json-game-parser';
import { DraftKingsStartDateParser } from './draft-kings-start-date-parser';

export class DraftKingsDbGameConnection extends DbGameConnection {
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedStartDateParser: DraftKingsStartDateParser | undefined;
  private wrappedJsonGameParser: DraftKingsJsonGameParser | undefined;

  public static async create({
    parent,
  }: {
    parent: OddButtonParser,
  }): Promise<DraftKingsDbGameConnection> {
    const draftKingsDbGameConnection = new DraftKingsDbGameConnection({ parent });
    await draftKingsDbGameConnection.init();
    return draftKingsDbGameConnection;
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

  private async parseMatchupAndExchangeAssignedGameId(): Promise<DraftKingsDbGameConnection> {
    const button = this.parent.button!;
    const parentTr = await button.evaluateHandle((el) => (el.closest('tr')!));
    const eventCellLink = (await parentTr.$('a.event-cell-link'))!;
    const href = await eventCellLink.evaluate((el) => (el.getAttribute('href')!));
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
      parent: this,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });
    this.game = this.jsonGameParser.game;
    return this.game;
  }

  private async findOrCreateGameByMatchupAndStartDate(): Promise<GameWithTeams> {
    try {
      /**If a startDate is available, we use it to find OR create the db game. */
      this.startDateParser = await DraftKingsStartDateParser.create({
        parent: this,
      });
      this.game = await GameService.findOrCreateByMatchupAndStartDate({
        awayTeam: this.awayTeam,
        homeTeam: this.homeTeam,
        startDate: this.startDateParser.startDate,
        createdBy: 'DraftKings findOrCreateGameByMatchupAndStartDate',
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
}