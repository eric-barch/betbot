import { Team } from '@prisma/client';
import { ElementHandle } from 'puppeteer';

import { DbUtilityFunctions, GameWithTeams, prisma } from '@/db';
import { DbGameInitializer, SpecializedDbGameInitializer } from '@/parsers/models/common-models';

import { DraftKingsStartDateParser } from './draft-kings-start-date-parser';

export class DraftKingsDbGameInitializer implements SpecializedDbGameInitializer {
  private readonly parentDbGameInitializer: DbGameInitializer;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;
  private wrappedStartDateParser: DraftKingsStartDateParser | undefined;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedGame: GameWithTeams | undefined;

  public constructor({
    parentDbGameInitializer,
  }: {
    parentDbGameInitializer: DbGameInitializer,
  }) {
    this.parentDbGameInitializer = parentDbGameInitializer;
  }

  public async findOrCreateGame(): Promise<GameWithTeams> {
    await this.parseMatchupAndExchangeAssignedGameId();

    try {
      return await this.findGameByExchangeAssignedGameId();
    } catch {
      return await this.findOrCreateGameByMatchupAndStartDate();
    }
  }

  private async parseMatchupAndExchangeAssignedGameId(): Promise<void> {
    const button = this.parentDbGameInitializer.button;

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
  }

  private async parseMatchup({
    href,
  }: {
    href: string,
  }): Promise<void> {
    const teamNamesMatchPattern = new RegExp(/\/([^/]+)%40([^/]+)\//);
    const teamNameMatches = teamNamesMatchPattern.exec(href);

    if (!teamNameMatches || teamNameMatches.length !== 3) {
      throw new Error(`Incorrect number of teamNameMatches.`);
    }

    const league = this.parentDbGameInitializer.league;

    this.awayTeam = await DbUtilityFunctions.findTeamByUnformattedNameAndLeague({
      league,
      unformattedName: teamNameMatches[1],
    });

    this.homeTeam = await DbUtilityFunctions.findTeamByUnformattedNameAndLeague({
      league,
      unformattedName: teamNameMatches[2],
    });
  }

  private parseExchangeAssignedGameId({
    href,
  }: {
    href: string,
  }): void {
    const exchangeAssignedGameIdMatchPattern = new RegExp(/\/([^/]+)$/);
    const exchangeAssignedGameIdMatches = exchangeAssignedGameIdMatchPattern.exec(href);

    if (!exchangeAssignedGameIdMatches || exchangeAssignedGameIdMatches.length !== 2) {
      throw new Error(`Incorrect number of exchangeAssignedGameIdMatches.`);
    }

    this.exchangeAssignedGameId = exchangeAssignedGameIdMatches[1];
  }

  private async findGameByExchangeAssignedGameId(): Promise<GameWithTeams> {
    const exchangeToGame = await prisma.exchangeToGame.findUniqueOrThrow({
      where: {
        exchangeId_exchangeAssignedGameId: {
          exchangeId: this.parentDbGameInitializer.exchange.id,
          exchangeAssignedGameId: this.exchangeAssignedGameId,
        },
      },
      include: {
        game: {
          include: {
            awayTeam: true,
            homeTeam: true,
          }
        }
      }
    });

    return exchangeToGame.game;
  }

  private async findOrCreateGameByMatchupAndStartDate(): Promise<GameWithTeams> {
    this.startDateParser = await DraftKingsStartDateParser.create({
      parentDbGameInitializer: this.parentDbGameInitializer,
    });

    const startDate = this.startDateParser.startDate;

    this.game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam: this.awayTeam,
      homeTeam: this.homeTeam,
      startDate: this.startDateParser.startDate,
    });

    const exchangeId = this.parentDbGameInitializer.exchange.id;
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

  private set startDateParser(startDateParser: DraftKingsStartDateParser) {
    this.wrappedStartDateParser = startDateParser;
  }

  private get startDateParser(): DraftKingsStartDateParser {
    if (!this.wrappedStartDateParser) {
      throw new Error(`wrappedStartDateParser is undefined.`);
    }

    return this.wrappedStartDateParser;
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