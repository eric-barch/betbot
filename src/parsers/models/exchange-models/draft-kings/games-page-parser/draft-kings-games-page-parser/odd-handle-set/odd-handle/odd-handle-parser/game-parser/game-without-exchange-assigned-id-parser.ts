
import { DbUtilityFunctions } from '@/db';
import { Game } from '@prisma/client';
import { OddHandleParser } from '../odd-handle-parser';
import { MatchupParser } from './matchup-parser';
import { StartDateParser } from './start-date-parser';

// TODO: This is not a good name.
export class GameDetailsParser {
  private parentOddHandleParser: OddHandleParser;
  private exchangeAssignedGameId: string;
  private startDateParser: StartDateParser;
  private matchupParser: MatchupParser;
  private wrappedGame: Game | undefined;

  private constructor({
    parentOddHandleParser,
    exchangeAssignedGameId,
  }: {
    parentOddHandleParser: OddHandleParser,
    exchangeAssignedGameId: string,
  }) {
    this.parentOddHandleParser = parentOddHandleParser;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
    this.startDateParser = new StartDateParser({ parentOddHandleParser: this.parentOddHandleParser });
    this.matchupParser = new MatchupParser({ parentOddHandleParser: this.parentOddHandleParser });
  }

  public static async create({
    parentOddHandleParser,
    exchangeAssignedGameId,
  }: {
    parentOddHandleParser: OddHandleParser,
    exchangeAssignedGameId: string,
  }): Promise<GameDetailsParser> {
    const gameDetailsParser = new GameDetailsParser({
      parentOddHandleParser,
      exchangeAssignedGameId,
    });
    await gameDetailsParser.parse();
    return gameDetailsParser;
  }

  private async parse(): Promise<Game> {
    await this.startDateParser.parse();
    await this.matchupParser.parse();

    this.game = await DbUtilityFunctions.findOrCreateGameByMatchupAndStartDate({
      awayTeam: this.matchupParser.awayTeam,
      homeTeam: this.matchupParser.homeTeam,
      startDate: this.startDateParser.startDate,
    });

    await DbUtilityFunctions.associateExchangeAndGameByExchangeAssignedGameId({
      exchange: this.parentOddHandleParser.exchange,
      game: this.game,
      exchangeAssignedGameId: this.exchangeAssignedGameId,
    });

    return this.game;
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