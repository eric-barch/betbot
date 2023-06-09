
import { DbUtilityFunctions } from '@/db';
import { OddButtonParser } from '@/parsers';
import { Game } from '@prisma/client';
import { DraftKingsMatchupParser } from './draft-kings-matchup-parser';
import { DraftKingsStartDateParser } from './draft-kings-start-date-parser';

export class DraftKingsGameParser {
  private parentOddButtonParser: OddButtonParser;
  private exchangeAssignedGameId: string;
  private startDateParser: DraftKingsStartDateParser;
  private matchupParser: DraftKingsMatchupParser;
  private wrappedGame: Game | undefined;

  private constructor({
    parentOddButtonParser,
    exchangeAssignedGameId,
  }: {
    parentOddButtonParser: OddButtonParser,
    exchangeAssignedGameId: string,
  }) {
    this.parentOddButtonParser = parentOddButtonParser;
    this.exchangeAssignedGameId = exchangeAssignedGameId;
    this.startDateParser = new DraftKingsStartDateParser({ parentOddButtonParser: this.parentOddButtonParser });
    this.matchupParser = new DraftKingsMatchupParser({ parentOddButtonParser: this.parentOddButtonParser });
  }

  public static async create({
    parentOddButtonParser,
    exchangeAssignedGameId,
  }: {
    parentOddButtonParser: OddButtonParser,
    exchangeAssignedGameId: string,
  }): Promise<DraftKingsGameParser> {
    const gameDetailsParser = new DraftKingsGameParser({
      parentOddButtonParser,
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
      exchange: this.parentOddButtonParser.exchange,
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