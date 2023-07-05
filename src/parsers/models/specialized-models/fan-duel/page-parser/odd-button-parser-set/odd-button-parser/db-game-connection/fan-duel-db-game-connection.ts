import { Team } from '@prisma/client';

import { GameService, GameWithTeams, TeamService } from '@/db';
import { DbGameConnection, SpecializedDbGameConnection } from '@/parsers/models/common-models';

import { FanDuelJsonGameParser } from './fan-duel-json-game-parser';

export class FanDuelDbGameConnection implements SpecializedDbGameConnection {
  private readonly parentDbGameConnection: DbGameConnection;
  private wrappedAwayTeam: Team | undefined;
  private wrappedHomeTeam: Team | undefined;
  private wrappedExchangeAssignedGameId: string | undefined;
  private wrappedJsonGameParser: FanDuelJsonGameParser | undefined;
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

    throw new Error(`Finish implementing findOrCreateGame.`);
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
    //this.game = this.jsonGameParser.game;
    return this.game;
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