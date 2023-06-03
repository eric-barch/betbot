import * as p from 'puppeteer';

import { Exchange, Game } from '@prisma/client';
import { GameParser } from './game-parser';
import { StartDateParser } from './start-date-parser';
import { MatchupParser } from './matchup-parser';
import { DbUtilityFunctions } from '@/db';

// TODO: This is not a good name.
export class GameWithoutExchangeAssignedIdParser {
  private parent: GameParser;
  private startDateParser: StartDateParser;
  private matchupParser: MatchupParser;
  private wrappedGame: Game | undefined;

  constructor({
    parent,
  }: {
    parent: GameParser,
  }) {
    this.parent = parent;
    this.startDateParser = new StartDateParser({ parent: this });
    this.matchupParser = new MatchupParser({ parent: this });
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

  public get buttonElement(): p.ElementHandle {
    return this.parent.buttonElement;
  }

  public get exchange(): Exchange {
    return this.parent.exchange;
  }

  public get exchangeAssignedGameId(): string {
    return this.parent.exchangeAssignedGameId;
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