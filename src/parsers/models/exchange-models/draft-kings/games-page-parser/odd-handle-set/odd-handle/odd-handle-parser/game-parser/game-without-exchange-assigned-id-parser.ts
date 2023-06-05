import * as p from 'puppeteer';

import { Exchange, Game } from '@prisma/client';
import { StartDateParser } from './start-date-parser';
import { MatchupParser } from './matchup-parser';
import { DbUtilityFunctions } from '@/db';
import { OddHandle } from '../../odd-handle';

// TODO: This is not a good name.
export class GameWithoutExchangeAssignedIdParser {
  private parentOddHandle: OddHandle;
  private startDateParser: StartDateParser;
  private matchupParser: MatchupParser;
  private wrappedGame: Game | undefined;

  constructor({
    parentOddHandle,
  }: {
    parentOddHandle: OddHandle,
  }) {
    this.parentOddHandle = parentOddHandle;
    this.startDateParser = new StartDateParser({ parentOddHandle: this.parentOddHandle });
    this.matchupParser = new MatchupParser({ parentOddHandle: this.parentOddHandle });
  }

  public async parse(): Promise<Game> {
    await this.startDateParser.parse();
    await this.matchupParser.parse();

    this.game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam: this.matchupParser.awayTeam,
      homeTeam: this.matchupParser.homeTeam,
      startDate: this.startDateParser.startDate,
    });

    await DbUtilityFunctions.associateExchangeAndGameByExchangeAssignedGameId({
      exchange: this.exchange,
      game: this.game,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });

    return this.game;
  }

  private get exchange(): Exchange {
    return this.parentOddHandle.exchange;
  }

  private get exchangeAssignedGameId(): string {
    return this.parentOddHandle.exchangeAssignedGameId;
  }

  public get game(): Game {
    if (!this.wrappedGame) {
      throw new Error(`wrappedGame is undefined.`);
    }

    return this.wrappedGame;
  }

  private set game(game: Game) {
    this.wrappedGame = game;
  }
}